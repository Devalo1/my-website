import os
import sys
import shutil  # Import pentru copiere

def should_exclude(path, exclude_patterns):
    """
    Verifică dacă un fișier sau director ar trebui exclus pe baza unui set de pattern-uri.
    """
    for pattern in exclude_patterns:
        if pattern in path:
            return True
    return False

def compare_directories_with_details(dir1, dir2):
    print(f"Comparing directories with details: {dir1} and {dir2}")
    
    # Definește directoarele și fișierele de exclus
    exclude_patterns = ["node_modules", ".git", ".venv"]

    # Obține listele de fișiere din ambele directoare
    files_in_dir1 = set()
    for root, _, files in os.walk(dir1):
        if should_exclude(root, exclude_patterns):
            continue
        for file in files:
            relative_path = os.path.relpath(os.path.join(root, file), dir1)
            if not should_exclude(relative_path, exclude_patterns):
                files_in_dir1.add(relative_path)

    files_in_dir2 = set()
    for root, _, files in os.walk(dir2):
        if should_exclude(root, exclude_patterns):
            continue
        for file in files:
            relative_path = os.path.relpath(os.path.join(root, file), dir2)
            if not should_exclude(relative_path, exclude_patterns):
                files_in_dir2.add(relative_path)

    # Compară fișierele
    only_in_dir1 = files_in_dir1 - files_in_dir2
    only_in_dir2 = files_in_dir2 - files_in_dir1
    common_files = files_in_dir1 & files_in_dir2

    # Afișează rezultatele
    if only_in_dir1:
        print("Files only in source directory:")
        for file in only_in_dir1:
            print(f"  {file}")
    else:
        print("No files are unique to the source directory.")

    if only_in_dir2:
        print("Files only in destination directory:")
        for file in only_in_dir2:
            print(f"  {file}")
    else:
        print("No files are unique to the destination directory.")

    if common_files:
        print("Common files in both directories:")
        for file in common_files:
            print(f"  {file}")
    else:
        print("No common files between the directories.")

def check_essential_files_and_directories(dir_path, required_items):
    """
    Verifică dacă fișierele și directoarele esențiale există în directorul specificat.
    """
    print(f"Checking essential files and directories in: {dir_path}")
    missing_items = []

    for item in required_items:
        item_path = os.path.join(dir_path, item)
        if not os.path.exists(item_path):
            missing_items.append(item)

    if missing_items:
        print("Missing essential files or directories:")
        for item in missing_items:
            print(f"  {item}")
    else:
        print("All essential files and directories are present.")

def copy_missing_items(source_dir, dest_dir, items):
    """
    Copiază fișierele și directoarele lipsă din sursă în destinație.
    """
    print(f"Copying missing items from {source_dir} to {dest_dir}")
    for item in items:
        source_path = os.path.join(source_dir, item)
        dest_path = os.path.join(dest_dir, item)

        if os.path.exists(source_path):
            if os.path.isdir(source_path):
                shutil.copytree(source_path, dest_path, dirs_exist_ok=True)
                print(f"Copied directory: {item}")
            else:
                os.makedirs(os.path.dirname(dest_path), exist_ok=True)
                shutil.copy2(source_path, dest_path)
                print(f"Copied file: {item}")
        else:
            print(f"Source item does not exist and cannot be copied: {item}")

def warn_if_essential_items_missing_in_source(source_dir, items):
    """
    Afișează un avertisment dacă fișierele esențiale lipsesc complet din sursă.
    """
    missing_items = []
    for item in items:
        source_path = os.path.join(source_dir, item)
        if not os.path.exists(source_path):
            missing_items.append(item)

    if missing_items:
        print("\nWarning: The following essential items are missing completely from the source directory:")
        for item in missing_items:
            print(f"  {item}")
        print("Please ensure these items are present in the source directory before proceeding.")

def validate_source_before_copying(source_dir, items):
    """
    Verifică dacă toate fișierele esențiale există în sursă înainte de a începe copierea.
    """
    missing_items = []
    for item in items:
        source_path = os.path.join(source_dir, item)
        if not os.path.exists(source_path):
            missing_items.append(item)

    if missing_items:
        print("\nError: The following essential items are missing from the source directory:")
        for item in missing_items:
            print(f"  {item}")
        print("Cannot proceed with copying. Please ensure these items are present in the source directory.")
        return False
    return True

if __name__ == "__main__":
    if len(sys.argv) == 2:
        dir1 = "C:\\Proiect\\my-website"  # Directorul sursă implicit
        dir2 = sys.argv[1]  # Directorul destinație specificat de utilizator
        compare_directories_with_details(dir1, dir2)

        # Verifică fișierele și directoarele esențiale
        essential_items = [
            "config/settings.json",  # Configurația aplicației
            "pages",                 # Pagini
            "static",                # Resurse statice
            "vite.config.ts",        # Configurația Vite
            "dist",                  # Directorul generat de build-ul Vite
            "node_modules",          # Dependențe instalate
            "package.json",          # Fișierul de configurare npm
            "package-lock.json"      # Lockfile-ul npm
        ]
        print("\nChecking essential items in source directory:")
        check_essential_files_and_directories(dir1, essential_items)
        print("\nChecking essential items in destination directory:")
        check_essential_files_and_directories(dir2, essential_items)

        # Avertizează dacă elementele esențiale lipsesc complet din sursă
        warn_if_essential_items_missing_in_source(dir1, essential_items)

        # Validează sursa înainte de copiere
        if validate_source_before_copying(dir1, essential_items):
            # Copiază elementele lipsă din sursă în destinație
            print("\nCopying missing essential items to destination directory:")
            copy_missing_items(dir1, dir2, essential_items)
    else:
        print("Usage: python compare_directories.py <destination_directory>")
