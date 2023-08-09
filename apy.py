import pandas as pd

sheet_name = "semcard.xls"

df = pd.read_excel(sheet_name,  skiprows=[0])
print(df.head())
for index, row in df.iterrows():
    print(f"Row {index + 2}:")
    for column_name, cell_value in row.items():
        print(f"    {column_name}: {cell_value}")
    print()
