$(function () {
  $('#storeLead').validate({
    rules: {
      name: { required: true },
      email: { required: true, email: true },
      mobile: { required: true, digits: true },
      message: { required: true },
    },
    messages: {
      name: 'Please enter your name',
      email: 'Please enter a valid email address',
      mobile: 'Please enter a valid phone number without spaces',
      message: 'Please enter a message',
    },
    errorPlacement: function (error, element) {
      if (element.attr('name') === 'mobile') {
        error.insertAfter(element.parent());
      } else {
        error.insertAfter(element);
      }
    },
    submitHandler: function (form) {
      const $form = $(form);
      const formData = $form.serialize();
      const $submitBtn = $('#submitButton');

      $submitBtn.prop('disabled', true);

      // Prevent double submission if Swal is already open
      if (Swal.isVisible()) return;

      // Show loading state
      Swal.fire({
        title: 'Sending...',
        text: 'Please wait while we process your request.',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      fetch('https://hydro-cleansing.com/api/capture-leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      })
        .then(response => {
          if (response.ok) {
            // Try to parse JSON, but fallback to empty object if response is empty
            return response.json().catch(() => ({}));
          }
          // If response is not ok, throw an error
          return response.text().then(text => {
            throw new Error(text || 'Server responded with an error');
          });
        })
        .then(data => {
          Swal.fire({
            title: 'Thank you!',
            html: 'Your message has been sent.<br>If you need us urgently, call <b><a href="tel:08007408888">0800 740 8888</a></b>.',
            icon: 'success',
          }).then(() => {
            form.reset();
            $submitBtn.prop('disabled', false);
          });
        })
        .catch(err => {
          console.error('Form submission error:', err);
          Swal.fire(
            'Error',
            'There was a problem sending your message. Please try again.<br>' +
              (err.message ? err.message : 'Unknown error'),
            'error'
          );
          $submitBtn.prop('disabled', false);
        });

      return false;
    },
  });
});
