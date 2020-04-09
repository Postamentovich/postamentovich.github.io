$(".card").each(function (e) {
    if ($(this).hasClass("card_size_s")) {
        $(this).css({ "border-radius": "22px" });
    } else {
        $(this).css({ "border-radius": "54px" });
    }
});

const TEMPS = {
    manual: -10,
    cold: 0,
    warm: 23,
    hot: 30,
};

document.addEventListener("DOMContentLoaded", function () {
    $(".card").each(function (e) {
        if ($(this).hasClass("card_size_s")) {
            $(this).css({ "border-radius": "22px" });
        } else {
            $(this).css({ "border-radius": "23px" });
        }
    });
    var waterContainer = document.querySelector(".card.card_size_s:last-child");

    waterContainer.innerHTML =
        '<div class="card-heading">' +
        '<div class="card-icon-wrap">' +
        '<img class="card-icon" src="img/kettle.svg">' +
        "</div>" +
        '<h3 class="card-title">Вода вскипела</h3>' +
        " </div>" +
        '<div class="card-specs">' +
        '<p class="card-source">Чайник</p>' +
        '<p class="card-time card-time_block">16:20, Сегодня</p>' +
        "</div>";
});

const selectButtonText = document.querySelector(".filter__select-button .button__text");
const selectOptions = document.querySelectorAll(".filter__select-item");
const popup = document.querySelector(".filter__select-popup");

selectOptions.forEach((o) => {
    o.addEventListener("click", function (e) {
        document.querySelector("#" + e.target.dataset.group).checked = true;

        selectOptions.forEach((opt) => opt.classList.toggle("filter__select-item_checked", false));
        e.target.classList.toggle("filter__select-item_checked", true);
        popup.classList.toggle("filter__select-popup_open", false);
        selectButtonText.innerText = e.target.innerText;
    });
});

$(document).ready(function () {
    var carousel = $("#carousel");

    carousel.owlCarousel();
});

document.addEventListener(
    "DOMContentLoaded",
    function () {
        const buttonsContainer = document.querySelector(".buttons-wrap");
        const fridgeInfoContainer = document.querySelector(
            ".card_size_m:nth-child(8) .card-description"
        );
        setTimeout(function () {
            const confirmPurchaseButton = document.querySelector(".buttons-wrap .button_yellow");
            const purchaseListContainer = document.createElement("div");
            const purchaseListTitle = document.createElement("p");
            const purchaseList = document.createElement("ol");
            const purchaseListItemOne = document.createElement("li");
            const purchaseListItemTwo = document.createElement("li");

            purchaseListContainer.setAttribute("class", "purchase-list-wrap");
            purchaseListTitle.setAttribute(
                "class",
                "card-description card-description_big description_critical"
            );
            purchaseListTitle.textContent = "Список покупок:";
            purchaseList.setAttribute("class", "purchase-list");
            purchaseListItemOne.setAttribute("class", "purchase-list__item");
            purchaseListItemOne.textContent = "Хлеб";
            purchaseListItemTwo.setAttribute("class", "purchase-list__item");
            purchaseListItemTwo.textContent = "Молоко";

            purchaseListContainer.appendChild(purchaseListTitle);
            purchaseListContainer.appendChild(purchaseList);
            purchaseList.appendChild(purchaseListItemOne);
            purchaseList.appendChild(purchaseListItemTwo);

            confirmPurchaseButton.onclick = () => {
                fridgeInfoContainer.replaceWith(purchaseListContainer);
                buttonsContainer.style.display = "none";
            };
        }, 500);

        document
            .getElementsByClassName("header-menu__switcher")[0]
            .addEventListener("click", function () {
                document
                    .getElementsByClassName("header-menu")[0]
                    .classList.toggle("header-menu_active");
            });
    },
    !1
);
