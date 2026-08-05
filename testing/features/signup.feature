Feature: User sign-up

  Scenario: Submit a valid sign-up form
    Given I open the sign-up page
    When I complete the sign-up form with valid details
    And I submit the sign-up form
    Then the sign-up confirmation message should be displayed