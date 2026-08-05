Feature: User authentication

    Scenario: User logs in with valid credentials
        Given the user is on the login page
        When the user enters the credentials "admin@hotmail.com" and "12345678"
        And the user submits the credentials
        Then the "Finance" button should be visible
        And the "Health" button should be visible
        And the "Log out" button should be visible

    Scenario: Required login fields display validation messages
        Given the user is on the login page
        When the user leaves the "email" field empty
        Then the message "Email address is required" should be visible
        When the user leaves the "password" field empty
        Then the message "Password is required" should be visible
        And the "Log in" button should be disabled

    Scenario: Password is shorter than the minimum length
        Given the user is on the login page
        When the user enters "hello@example.com" into the "Email address" field
        And the user enters "1234567" into the "Password" field
        Then the message "Password must contain a minimum of 8 characters" should be visible
        And the "Log in" button should be disabled

    Scenario: User logs in with incorrect credentials
        Given the user is on the login page
        When the user enters the credentials "hello@example.com" and "12145678"
        And the user submits the credentials
        Then the message "Incorrect email or password" should be visible
        And the "Log in" button should be visible
        And the "Finance" button should not be visible