import pandas as pd

def remove_nan_genres(input_file, output_file):
    # Read the CSV file
    df = pd.read_csv(input_file)
    
    # Remove rows with NaN values in the genres column
    df_cleaned = df.dropna(subset=['genres'])
    
    # Save the cleaned DataFrame to a new CSV file
    df_cleaned.to_csv(output_file, index=False)

def main():
    input_file = 'Machine Learning\\Python Scripts\\Finalized_data.csv'  # Replace with your input CSV file path
    output_file = 'Machine Learning\\Python Scripts\\Final_data.csv'  # Replace with your output CSV file path
    
    remove_nan_genres(input_file, output_file)
    print(f'Saved cleaned data to {output_file}')

if __name__ == "__main__":
    main()
