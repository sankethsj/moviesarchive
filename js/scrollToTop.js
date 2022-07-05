
var scrollToTopBtn = document.querySelector(".scrollTop")
var rootElement = document.documentElement

function scrollAnimationStep() {
  // Do something on scroll
 
  var scrollTotal = rootElement.scrollHeight - rootElement.clientHeight
   
  if ((rootElement.scrollTop / scrollTotal ) > 0.1) {
    // Show button
    scrollToTopBtn.style.display = 'block'
  } else {
    // Hide button
    scrollToTopBtn.style.display = 'none'
  }
}

function scrollToTop() {
  rootElement.scrollTo({
    top: 0,
    behavior: "smooth"
  })
}
scrollToTopBtn.addEventListener("click", scrollToTop)
document.addEventListener("scroll", scrollAnimationStep)