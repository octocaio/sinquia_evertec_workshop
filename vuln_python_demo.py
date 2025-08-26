import os

def run_command(user_input):
    # Vulnerable to command injection
    os.system("echo " + user_input)

if __name__ == "__main__":
    user_data = input("Enter something to echo: ")
    run_command(user_data)