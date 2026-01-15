const form = document.querySelector(".form");

form.addEventListener("change", () => {
  const selectedProfile = document.querySelector("input[name='profile']:checked");
  if (selectedProfile) {
    console.log("Selected profile:", selectedProfile.value);
  }
});
