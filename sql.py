import sqlite3

connection = sqlite3.connect("student.db")

cursor=connection.cursor()

table_info="""
Create table STUDENT(NAME VARCHAR(25),CLASS VARCHAR(25),SECTION VARCHAR(25));
"""

cursor.execute(table_info)


cursor.execute('''INSERT INTO STUDENT VALUES ('Krish', 'Data Science', 'A')''') 
cursor.execute('''INSERT INTO STUDENT VALUES ('Darius', 'Data Science', 'B')''') 
cursor.execute('''INSERT INTO STUDENT VALUES ('Sudhanshu', 'Devops', 'C')''') 
cursor.execute('''INSERT INTO STUDENT VALUES ('Vikash', 'Data Science', 'C')''') 


print("The inserted records are :")

data =cursor.execute('''SELECT * FROM STUDENT''')

for row in data:
    print(row)

connection.commit()
connection.close()
