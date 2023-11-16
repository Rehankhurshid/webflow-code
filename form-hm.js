$(document).ready(function () {
  // Initialize the validation
  var validator = $("#email-form").validate({
    rules: {
      email: {
        required: true,
        email: true
      }
      // Add other rules as needed
    },
    messages: {
      email: {
        required: "Please enter an email address.",
        email: "Please enter a valid email address."
      }
      // Add other messages as needed
    }
  });
});
