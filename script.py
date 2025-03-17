import csv

def csv_to_sql(csv_file, table_name, output_sql):
    with open(csv_file, 'r', encoding='utf-8') as file:
        reader = csv.reader(file)
        headers = next(reader)
        
        with open(output_sql, 'w', encoding='utf-8') as sql_file:
            sql_file.write(f'CREATE TABLE {table_name} ({', '.join([h + " TEXT" for h in headers])});\n')
            
            for row in reader:
                values = ', '.join([f'"{value.replace("\"", "\"\"")}"' for value in row])
                sql_file.write(f'INSERT INTO {table_name} ({', '.join(headers)}) VALUES ({values});\n')
    
    print(f'Archivo SQL generado: {output_sql}')
    def format_values(row):
        formatted_values = []
        for value in row:
            if value.isdigit():
                formatted_values.append(value)
            else:
                formatted_values.append(f'"{value.replace("\"", "\"\"")}"')
        return ', '.join(formatted_values)

    # Update the csv_to_sql function to use format_values
    def csv_to_sql(csv_file, table_name, output_sql):
        with open(csv_file, 'r', encoding='utf-8') as file:
            reader = csv.reader(file)
            headers = next(reader)
            
            with open(output_sql, 'w', encoding='utf-8') as sql_file:
                sql_file.write(f'CREATE TABLE {table_name} ({", ".join([h + " TEXT" for h in headers])});\n')
                
                for row in reader:
                    values = format_values(row)
                    sql_file.write(f'INSERT INTO {table_name} ({", ".join(headers)}) VALUES ({values});\n')
        
        print(f'Archivo SQL generado: {output_sql}')
# Ejemplo de uso:
csv_to_sql('./Database/datos_icfes.csv', 'icfes_resultados', 'c:/xampp/htdocs/Sistema-universidad/output.sql')