# imports
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_text_splitters import CharacterTextSplitter
from langchain_core.prompts import PromptTemplate
from langchain_core.vectorstores.base import VectorStoreRetriever
from langchain_chroma import Chroma

# Load Environment Vars
load_dotenv()

# Initialize the LLM
llm = ChatOpenAI(model="gpt-4o-mini")

# Get Embeddings Model
embeddings = OpenAIEmbeddings(model="text-embedding-3-large")

# Initialize Text Splitter
text_splitter = CharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=200,
    length_function=len
)

# Initialize ChromaDB as Vector Store
vector_store = Chroma(
    persist_directory="chroma",
    collection_name="test_collection",
    embedding_function=embeddings
)

# Set how many chunks we want
n = 10

# Set Chroma as the Retriever
retriever = vector_store.as_retriever(search_kwargs={"k": n})

# Create the Prompt Template
prompt_template = """Use the context provided to answer the user's question 
below. If you do not know the answer based on the context provided, tell the
user that you do not know the answer to their question based on the context
provided and that you are sorry.
context: {context}

question: {query}

answer: """

# Create Prompt Instance from template
custom_rag_prompt = PromptTemplate.from_template(prompt_template)

# Pre-retrieval Query Rewriting Function
def query_rewrite(query: str, llm: ChatOpenAI):

    # Rewritten Query Prompt
    query_rewrite_prompt = f"""You are a helpful assistant that takes a
    user's query and turns it into a short statement or paragraph so that
    it can be used in a semantic similarity search on a vector database to
    return the most similar chunks of content based on the rewritten query.
    Please make no comments, just return the rewritten query.
    \n\nquery: {query}\n\nai: """

    # Invoke LLM
    retrieval_query = llm.invoke(query_rewrite_prompt)

    # Return Generated Retrieval Query
    return retrieval_query

# Create Document Parsing Function to String
def format_docs(docs):
    return "\n\n---\n\n".join(doc.page_content for doc in docs)

# Custom RAG Chain Class
class RAGChain:

    # Chain Constructor
    def __init__(
        self,
        llm: ChatOpenAI,
        retriever: VectorStoreRetriever,
        prompt: PromptTemplate
    ):
        self.llm = llm
        self.retriever = retriever
        self.prompt = prompt

    # Run Chain Function - same naming convention as LangChain
    def invoke(self, query: str):

        # Advanced RAG: Pre-retrieval Query Rewrite
        retrieval_query = query_rewrite(query, self.llm)
            
        # Retrieval w/ Post-retrieval Reranking
        docs = self.retriever.invoke(retrieval_query.content)

        # Format Docs for Context String
        context = format_docs(docs)

        # Prompt Template
        final_prompt = self.prompt.format(context=context, query=query)

        # LLM Invoke
        return (final_prompt, llm.invoke(final_prompt))
    
    # Stream Invoke of Rag Chain
    def stream(self, query: str):

        # Advanced RAG: Pre-retrieval Query Rewrite
        retrieval_query = query_rewrite(query, self.llm)

        # Retrieval w/ Post-retrieval Reranking
        docs = self.retriever.invoke(retrieval_query.content)

        # Format Docs for Context String
        context = format_docs(docs)

        # Prompt Template
        final_prompt = self.prompt.format(context=context, query=query)

        # Stream the response from the LLM
        for token in self.llm.stream(final_prompt):
            yield token

# Initialize Custom RAG Chain
rag_chain = RAGChain(llm, retriever, custom_rag_prompt)