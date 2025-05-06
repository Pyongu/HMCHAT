from langchain_chroma import Chroma
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_community.document_loaders.pdf import PyPDFDirectoryLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from dotenv import load_dotenv

# Load Environment Vars
load_dotenv()

# Initialize the LLM
llm = ChatOpenAI(model="gpt-4o-mini")

# Get Embeddings Model
embeddings = OpenAIEmbeddings(model="text-embedding-3-large")

def calculate_chunk_ids(chunks):

    # This will create IDs like "data/monopoly.pdf:6:2"
    # Page Source : Page Number : Chunk Index

    last_page_id = None
    current_chunk_index = 0

    for chunk in chunks:
        source = chunk.metadata.get("source")
        page = chunk.metadata.get("page")
        current_page_id = f"{source}:{page}"
        # If the page ID is the same as the last one, increment the index.
        if current_page_id == last_page_id:
            current_chunk_index += 1
        else:
            current_chunk_index = 0

        # Calculate the chunk ID.
        chunk_id = f"{current_page_id}:{current_chunk_index}"
        last_page_id = current_page_id
        # print(chunk_id)
        # Add it to the page meta-data.
        chunk.metadata["id"] = chunk_id

    return chunks

db = Chroma(
    persist_directory="chroma", # automatic persist
    embedding_function=embeddings,
    collection_name="test_collection"
)

document_loader = PyPDFDirectoryLoader("data")
documents = document_loader.load()

text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=400,
        chunk_overlap=80,
        length_function=len,
        is_separator_regex=False,
    )

chunks = text_splitter.split_documents(documents)


# Calculate Page IDs.
chunks_with_ids = calculate_chunk_ids(chunks)

# Add or Update the documents.
existing_items = db.get(include=[])  # IDs are always included by default
existing_ids = set(existing_items["ids"])
print(f"Number of existing documents in DB: {len(existing_ids)}")

# Only add documents that don't exist in the DB.
new_chunks = []
for chunk in chunks_with_ids:
    if chunk.metadata["id"] not in existing_ids:
        new_chunks.append(chunk)

if new_chunks:
    print(f"👉 Adding new documents: {len(new_chunks)}")
    new_chunk_ids = [chunk.metadata["id"] for chunk in new_chunks]
    db.add_documents(new_chunks, ids=new_chunk_ids)
else:
    print("✅ No new documents to add")

