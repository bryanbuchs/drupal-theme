document.addEventListener('click', function (event) {
  if (event.target.closest('a[href="LINK"]')) {
    // Remove class from all links
    var links = document.querySelectorAll('a')
    links.forEach(function (link) {
      link.classList.remove('is-active-trail')
    })

    // Apply class to the clicked element
    event.target.classList.add('is-active-trail')
  }
})
