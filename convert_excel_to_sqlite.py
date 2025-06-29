import pandas as pd
import sqlite3

def excel_to_sqlite(excel_file, db_file):
    """
    Converts an Excel file to a SQLite database.

    Args:
        excel_file (str): The path to the Excel file.
        db_file (str): The path to the SQLite database file.
    """
    try:
        excel_data = pd.ExcelFile(excel_file)
        sheet_names = excel_data.sheet_names

        conn = sqlite3.connect(db_file)
        cursor = conn.cursor()

        for sheet_name in sheet_names:
            df = excel_data.parse(sheet_name, header=None)

            # Assuming the first row contains theater names and the first column contains dates
            theater_names = df.iloc[0, 1:].tolist()
            dates = df.iloc[1:, 0].tolist()

            # Create a table for movie schedules
            cursor.execute(f"DROP TABLE IF EXISTS movie_schedule")
            cursor.execute(f"CREATE TABLE movie_schedule (theater TEXT, date TIMESTAMP, movie TEXT)")

            for i, date in enumerate(dates):
                for j, theater in enumerate(theater_names):
                    movie = df.iloc[i + 1, j + 1]
                    if pd.notna(movie):  # Only insert if there is a movie listed
                        cursor.execute("INSERT INTO movie_schedule (theater, date, movie) VALUES (?, ?, ?)", (theater, date.to_pydatetime().strftime('%Y-%m-%d'), movie))

        conn.commit()
        conn.close()

    except FileNotFoundError:
        print(f"Error: Excel file '{excel_file}' not found.")
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    excel_file_name = "Moziműsor.xlsx"
    db_file_name = "mozi.sqlite"
    excel_to_sqlite(excel_file_name, db_file_name)