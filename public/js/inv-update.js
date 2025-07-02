// Inv update button will not submit if no data has been changed.
const form = document.querySelector("#editInventoryForm");
if (form) {
    const updateBtn = form.querySelector("button[type='submit']");
    form.addEventListener("change", function () {
        if (updateBtn) updateBtn.removeAttribute("disabled");
    });
}