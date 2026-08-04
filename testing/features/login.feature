Feature: User authentication

    Scenario: User logs in with valid credentials
        Given the user is on the login page
        When the user enters the credentials "admin@hotmail.com" and "12345678"
        And the user submits the credentials
        Then the "Finance" button should be visible
        And the "Health" button should be visible
        And the "Log out" button should be visible