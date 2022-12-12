import csv
from google.cloud import firestore

db = firestore.Client()

# List of columns to upload
columns = ['name', 'serving_size', 'calories', 'total_fat', 'protein', 'carbohydrate']

collection_name = 'foodIngredients'

def convert_record(record):
    data = {k: record[k] for k in columns}
    cols = ['protein', 'total_fat', 'carbohydrate', 'serving_size', 'calories']

    for k in cols:
        data[k]=float(data.get(k).rstrip('g').strip())

    return data

def delete_collection(coll_ref, batch_size):
    docs = coll_ref.list_documents(page_size=batch_size)
    deleted = 0

    for doc in docs:
        print(f'Deleting doc {doc.id} => {doc.get().to_dict()}')
        doc.delete()
        deleted = deleted + 1

    if deleted >= batch_size:
        return delete_collection(coll_ref, batch_size)


# Delete the existing collection
delete_collection(db.collection(collection_name), 20)

# Open the CSV file and read in the records
print("Uploading data to firestore...")
with open('nutrition.csv', 'r') as csv_file:
    csv_reader = csv.DictReader(csv_file)

    # Iterate over the records and add each one to Firestore
    for record in csv_reader:
        # Create a new dictionary with only the selected columns
        data = convert_record(record)
        db.collection(collection_name).add(data)

print("Uploaded successfully")
