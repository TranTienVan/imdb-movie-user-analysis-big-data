import os
import json


def list_folders(directory_path):
    try:
        # Get all entries in the directory
        entries = os.listdir(directory_path)

        # Filter out only directories
        folders = [entry for entry in entries if os.path.isdir(os.path.join(directory_path, entry))]

        return folders
    except OSError as e:
        print(f"Error reading directory {directory_path}: {e}")
        return None

def list_files(directory_path):
    try:
        # Get all entries in the directory
        entries = os.listdir(directory_path)

        # Filter out only files
        files = [entry for entry in entries if os.path.isfile(os.path.join(directory_path, entry))]

        return files
    except OSError as e:
        print(f"Error reading directory {directory_path}: {e}")
        return None
    
    
