(function () {
    const button = document.createElement('button');
    button.innerText = 'Get Instant Quote';
    button.style.cssText = 'position: fixed; bottom: 10px; right: 10px; padding: 10px; background-color: #28a745; color: white; border: none; cursor: pointer; font-size: 16px;';
    document.body.appendChild(button);
  
    button.addEventListener('click', function () {
      // Create iframe container
      const iframe = document.createElement('iframe');
      iframe.src = "https://itsabzzz.github.io/insta-quote-tool";
      iframe.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; border: none; z-index: 9999; background-color: rgba(0, 0, 0, 0.8);';
      document.body.appendChild(iframe);
  
      // Close the modal by clicking outside the iframe
      iframe.addEventListener('click', function () {
        document.body.removeChild(iframe);
      });
    });
  })();
  