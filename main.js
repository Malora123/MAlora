document.addEventListener("DOMContentLoaded", function () {
  var navToggle = document.querySelector(".nav-toggle");
  var navLinks = document.querySelector(".nav-links");
  var dropdown = document.querySelector(".has-dropdown");
  var dropdownToggle = dropdown ? dropdown.querySelector(".dropdown-toggle") : null;
  var searchToggle = document.getElementById("search-toggle");
  var searchBar = document.querySelector(".search-bar");
  var searchInput = document.getElementById("search-input");
  var contactForm = document.getElementById("contact-form");
  var filterCategory = document.getElementById("filter-category");
  var filterType = document.getElementById("filter-type");
  var filterConcentration = document.getElementById("filter-concentration");
  var filterPrice = document.getElementById("filter-price");
  var categoryDisplay = document.getElementById("filter-category-display");
  var categoryDisplayText = categoryDisplay
    ? categoryDisplay.querySelector(".filter-category-display-text")
    : null;
  var categoryDisplayIcon = categoryDisplay ? categoryDisplay.querySelector("i") : null;
  var products = Array.prototype.slice.call(document.querySelectorAll(".product-card"));
  var WHATSAPP_PHONE = "201108021991";
  var WHATSAPP_BASE = "https://wa.me/" + WHATSAPP_PHONE + "?text=";
  var dropdownItems = Array.prototype.slice.call(document.querySelectorAll(".dropdown-item"));
  var categoryButtons = Array.prototype.slice.call(
    document.querySelectorAll(".filter-category-option")
  );
  var categoryTrigger = document.getElementById("filter-category-trigger");

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      navLinks.classList.toggle("open");
    });
  }

  if (categoryDisplay && categoryTrigger) {
    categoryTrigger.addEventListener("click", function (e) {
      e.stopPropagation();
      categoryDisplay.classList.toggle("open");
    });

    document.addEventListener("click", function (e) {
      if (!categoryDisplay.contains(e.target)) {
        categoryDisplay.classList.remove("open");
      }
    });
  }

  if (dropdown && dropdownToggle) {
    dropdownToggle.addEventListener("click", function (e) {
      e.stopPropagation();
      dropdown.classList.toggle("open");
    });

    document.addEventListener("click", function (e) {
      if (!dropdown.contains(e.target)) {
        dropdown.classList.remove("open");
      }
    });
  }

  if (searchToggle && searchBar) {
    searchToggle.addEventListener("click", function () {
      var isOpen = searchBar.classList.toggle("open");
      searchBar.setAttribute("aria-hidden", isOpen ? "false" : "true");
      if (isOpen && searchInput) {
        searchInput.focus();
      }
    });
  }

  function priceRangeFromDataset(priceValue) {
    if (priceValue === "low") return "low";
    if (priceValue === "mid") return "mid";
    if (priceValue === "high") return "high";
    return "all";
  }

  function updateCategoryDisplay(value) {
    if (!categoryDisplayText || !categoryDisplayIcon) return;

    var text = "All";
    var iconClass = "fa-solid fa-users";

    if (value === "men") {
      text = "Men";
      iconClass = "fa-solid fa-person";
    } else if (value === "women") {
      text = "Women";
      iconClass = "fa-solid fa-person-dress";
    } else if (value === "unisex") {
      text = "Unisex";
      iconClass = "fa-solid fa-venus-mars";
    }

    categoryDisplayText.textContent = text;
    categoryDisplayIcon.className = iconClass;
  }

  function applyFilters() {
    var categoryValue = filterCategory ? filterCategory.value : "all";
    var typeValue = filterType ? filterType.value : "all";
    var concentrationValue = filterConcentration ? filterConcentration.value : "all";
    var priceValue = filterPrice ? filterPrice.value : "all";
    var textQuery = searchInput ? searchInput.value.trim().toLowerCase() : "";

    if (categoryButtons.length) {
      categoryButtons.forEach(function (btn) {
        var btnValue = btn.getAttribute("data-value") || "all";
        if (btnValue === categoryValue) {
          btn.classList.add("is-active");
        } else {
          btn.classList.remove("is-active");
        }
      });
    }

    updateCategoryDisplay(categoryValue);

    products.forEach(function (card) {
      var cardCategory = card.getAttribute("data-category") || "";
      var cardType = card.getAttribute("data-type") || "";
      var cardConcentration = card.getAttribute("data-concentration") || "";
      var cardPrice = card.getAttribute("data-price") || "";
      var cardText = (card.textContent || "").toLowerCase();

      var cardCategories = cardCategory
        .split(",")
        .map(function (c) {
          return c.trim();
        })
        .filter(function (c) {
          return c.length > 0;
        });

      var matchCategory;
      if (categoryValue === "all") {
        matchCategory = true;
      } else if (categoryValue === "unisex") {
        matchCategory = cardCategories.indexOf("unisex") !== -1;
      } else {
        matchCategory =
          cardCategories.indexOf(categoryValue) !== -1 ||
          cardCategories.indexOf("unisex") !== -1;
      }
      var matchType = typeValue === "all" || cardType === typeValue;
      var matchConcentration =
        concentrationValue === "all" || cardConcentration === concentrationValue;
      var matchPrice =
        priceValue === "all" || priceRangeFromDataset(cardPrice) === priceValue;
      var matchText = !textQuery || cardText.indexOf(textQuery) !== -1;

      if (matchCategory && matchType && matchConcentration && matchPrice && matchText) {
        card.style.display = "flex";
      } else {
        card.style.display = "none";
      }
    });
  }

  if (filterCategory) {
    filterCategory.addEventListener("change", applyFilters);
  }

  if (categoryButtons.length && filterCategory) {
    categoryButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var value = btn.getAttribute("data-value") || "all";
        filterCategory.value = value;
        applyFilters();

        if (categoryDisplay) {
          categoryDisplay.classList.remove("open");
        }
      });
    });
  }

  if (filterType) {
    filterType.addEventListener("change", applyFilters);
  }

  if (filterConcentration) {
    filterConcentration.addEventListener("change", applyFilters);
  }

  if (filterPrice) {
    filterPrice.addEventListener("change", applyFilters);
  }

  if (searchInput) {
    searchInput.addEventListener("input", applyFilters);
  }

  if (dropdownItems.length > 0) {
    dropdownItems.forEach(function (item) {
      item.addEventListener("click", function () {
        var category = item.getAttribute("data-category");
        var typeValue = item.getAttribute("data-type");

        if (category && filterCategory) {
          filterCategory.value = category;
        }

        if (typeValue && filterType) {
          filterType.value = typeValue;
        }

        applyFilters();

        var shopSection = document.getElementById("shop");
        if (shopSection) {
          shopSection.scrollIntoView({ behavior: "smooth" });
        }
      });
    });
  }

  var sizeCards = Array.prototype.slice.call(
    document.querySelectorAll('.product-card[data-has-sizes="true"]')
  );

  sizeCards.forEach(function (card) {
    var sizeButtons = Array.prototype.slice.call(card.querySelectorAll(".size-option"));
    var sizeLabel = card.querySelector(".product-size");
    var priceEl = card.querySelector(".product-price");

    if (!sizeButtons.length || !sizeLabel || !priceEl) {
      return;
    }

    sizeButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        sizeButtons.forEach(function (b) {
          b.classList.remove("is-active");
        });

        btn.classList.add("is-active");

        var size = btn.getAttribute("data-size");
        var price = btn.getAttribute("data-price");

        if (size) {
          sizeLabel.textContent = size + "ml";
        }

        if (price) {
          priceEl.textContent = price + " EGP";
        }
      });
    });
  });

  var productDetailSection = document.getElementById("product-detail");
  var productDetailImage = productDetailSection
    ? productDetailSection.querySelector(".product-detail-image")
    : null;
  var productDetailName = productDetailSection
    ? productDetailSection.querySelector(".product-detail-name")
    : null;
  var productDetailMeta = productDetailSection
    ? productDetailSection.querySelector(".product-detail-meta")
    : null;
  var productDetailSize = productDetailSection
    ? productDetailSection.querySelector(".product-detail-size")
    : null;
  var productDetailType = productDetailSection
    ? productDetailSection.querySelector(".product-detail-type")
    : null;
  var productDetailPrice = productDetailSection
    ? productDetailSection.querySelector(".product-detail-price")
    : null;
  var productDetailDescription = productDetailSection
    ? productDetailSection.querySelector(".product-detail-description-text")
    : null;
  var productDetailWhatsApp = productDetailSection
    ? productDetailSection.querySelector(".product-detail-whatsapp")
    : null;
  var productDetailInstagram = productDetailSection
    ? productDetailSection.querySelector(".product-detail-instagram")
    : null;
  var productDetailBack = productDetailSection
    ? productDetailSection.querySelector(".product-detail-back")
    : null;
  var relatedGrid = productDetailSection
    ? productDetailSection.querySelector(".product-detail-related-grid")
    : null;
  var productDetailSizes = productDetailSection
    ? productDetailSection.querySelector(".product-detail-sizes")
    : null;

  function toggleMainSections(showMain) {
    var mainSections = document.querySelectorAll(
      ".hero, .shop-section, .about-section, .reviews-section, .contact-section, .footer"
    );
    var mainNavbar = document.querySelector(".main-navbar");
    
    mainSections.forEach(function (sec) {
      sec.style.display = showMain ? "" : "none";
    });
    
    if (mainNavbar) {
      mainNavbar.style.display = showMain ? "" : "none";
    }
  }

  function showProductDetail(card) {
    if (!productDetailSection) return;

    var nameEl = card.querySelector(".product-name");
    var metaEl = card.querySelector(".product-meta");
    var sizeEl = card.querySelector(".product-size");
    var priceElCard = card.querySelector(".product-price");
    var imageEl = card.querySelector(".product-image");

    var nameText = nameEl ? nameEl.textContent.trim() : "";
    var detailMetaAttr = card.getAttribute("data-detail-meta") || "";
    var metaText = detailMetaAttr || (metaEl ? metaEl.textContent.trim() : "");

    var sizeText = sizeEl ? sizeEl.textContent.trim() : "";
    if (!sizeText) {
      var detailsEl = card.querySelector(".product-details");
      if (detailsEl) {
        var firstSpan = detailsEl.querySelector("span");
        if (firstSpan) {
          sizeText = firstSpan.textContent.trim();
        }
      }
    }
    var typeText = card.getAttribute("data-type") || "";
    var priceText = priceElCard ? priceElCard.textContent.trim() : "";
    var descriptionText = card.getAttribute("data-description") || detailMetaAttr || "بخاخ جسم فاخر بتركيبة مميزة توفر انتعاشًا يدوم طوال اليوم. مثالي للاستخدام اليومي بعد الاستحمام أو قبل الخروج، يمنحك شعورًا بالثقة والحيوية.";

    if (productDetailName) productDetailName.textContent = nameText;
    if (productDetailMeta) productDetailMeta.textContent = metaText;
    if (productDetailSize) productDetailSize.textContent = sizeText;
    if (productDetailType) productDetailType.textContent = typeText;
    if (productDetailPrice) productDetailPrice.textContent = priceText;
    if (productDetailDescription) productDetailDescription.textContent = descriptionText;

    if (productDetailImage && imageEl) {
      productDetailImage.className = "product-detail-image product-image";
      imageEl.classList.forEach(function (cls) {
        if (cls.indexOf("product-image--") === 0) {
          productDetailImage.classList.add(cls);
        }
      });
    }

    if (productDetailSizes) {
      var sizesRow = card.querySelector(".product-sizes");
      if (sizesRow) {
        productDetailSizes.innerHTML = sizesRow.innerHTML;
        var detailSizeButtons = Array.prototype.slice.call(
          productDetailSizes.querySelectorAll(".size-option")
        );

        detailSizeButtons.forEach(function (btn) {
          btn.addEventListener("click", function () {
            detailSizeButtons.forEach(function (b) {
              b.classList.remove("is-active");
            });
            btn.classList.add("is-active");

            var size = btn.getAttribute("data-size");
            var price = btn.getAttribute("data-price");

            if (size && productDetailSize) {
              productDetailSize.textContent = size + "ml";
            }

            if (price && productDetailPrice) {
              productDetailPrice.textContent = price + " EGP";
            }

            // Update WhatsApp and Instagram links with selected size
            var currentSize = size + "ml";
            var currentName = productDetailName ? productDetailName.textContent.trim() : "";
            var whatsappMessage = "أرغب في طلب منتج " + currentName + " - الحجم: " + currentSize + " من MALORA Body Splash";
            if (productDetailWhatsApp) {
              productDetailWhatsApp.href = WHATSAPP_BASE + encodeURIComponent(whatsappMessage);
            }
            if (productDetailInstagram) {
              var instagramMessage = "أرغب في طلب منتج " + currentName + " - الحجم: " + currentSize + " من MALORA Body Splash";
              productDetailInstagram.href = "https://ig.me/m/mal0ra_?text=" + encodeURIComponent(instagramMessage);
            }
          });
        });
      } else {
        productDetailSizes.innerHTML = "";
      }
    }

    var currentCategory = card.getAttribute("data-category") || "";
    var currentCategories = currentCategory
      .split(",")
      .map(function (c) {
        return c.trim();
      })
      .filter(function (c) {
        return c.length > 0;
      });

    if (relatedGrid) {
      relatedGrid.innerHTML = "";
      products.forEach(function (other) {
        if (other === card) return;

        var otherCategory = other.getAttribute("data-category") || "";
        var otherCategories = otherCategory
          .split(",")
          .map(function (c) {
            return c.trim();
          })
          .filter(function (c) {
            return c.length > 0;
          });

        var showProduct = false;

        var currentHasMen = currentCategories.indexOf("men") !== -1;
        var currentHasWomen = currentCategories.indexOf("women") !== -1;
        var currentHasUnisex = currentCategories.indexOf("unisex") !== -1;
        
        var otherHasMen = otherCategories.indexOf("men") !== -1;
        var otherHasWomen = otherCategories.indexOf("women") !== -1;
        var otherHasUnisex = otherCategories.indexOf("unisex") !== -1;

        if (currentHasUnisex && !currentHasMen && !currentHasWomen) {
          showProduct = (otherHasUnisex && !otherHasMen && !otherHasWomen);
        } else if (currentHasMen && !currentHasWomen && !currentHasUnisex) {
          showProduct = (otherHasMen || otherHasUnisex);
        } else if (currentHasWomen && !currentHasMen && !currentHasUnisex) {
          showProduct = (otherHasWomen || (otherHasUnisex && !otherHasMen));
        } else if (currentHasWomen && currentHasUnisex) {
          showProduct = (otherHasWomen || (otherHasUnisex && !otherHasMen));
        } else if (currentHasMen && currentHasUnisex) {
          showProduct = (otherHasMen || otherHasUnisex);
        }

        if (!showProduct) return;

        var clone = other.cloneNode(true);
        clone.addEventListener("click", function () {
          showProductDetail(other);
        });
        relatedGrid.appendChild(clone);
      });
    }

    var whatsappText =
      "أرغب في طلب منتج " + nameText + " - الحجم: " + sizeText + " من MALORA Body Splash";
    if (productDetailWhatsApp) {
      productDetailWhatsApp.href = WHATSAPP_BASE + encodeURIComponent(whatsappText);
    }

    var instagramText = "أرغب في طلب منتج " + nameText + " - الحجم: " + sizeText + " من MALORA Body Splash";
    if (productDetailInstagram) {
      productDetailInstagram.href = "https://ig.me/m/mal0ra_?text=" + encodeURIComponent(instagramText);
    }

    toggleMainSections(false);
    productDetailSection.classList.add("is-active");
    productDetailSection.setAttribute("aria-hidden", "false");
    productDetailSection.scrollIntoView({ behavior: "smooth" });
  }

  if (productDetailSection && products.length) {
    products.forEach(function (card) {
      card.addEventListener("click", function (e) {
        if (e.target.closest(".size-option")) return;
        showProductDetail(card);
      });
    });

    if (productDetailBack) {
      productDetailBack.addEventListener("click", function () {
        productDetailSection.classList.remove("is-active");
        productDetailSection.setAttribute("aria-hidden", "true");
        toggleMainSections(true);

        var shopSection = document.getElementById("shop");
        if (shopSection) {
          shopSection.scrollIntoView({ behavior: "smooth" });
        }
      });
    }
  }

  products.forEach(function (card) {
    var orderButton = card.querySelector(".product-footer .btn.btn-outline");
    if (!orderButton) return;

    orderButton.addEventListener("click", function (e) {
      e.stopPropagation();

      var nameEl = card.querySelector(".product-name");
      var nameText = nameEl ? nameEl.textContent.trim() : "";
      
      // Get the selected size
      var activeSizeBtn = card.querySelector(".size-option.is-active");
      var sizeText = activeSizeBtn ? activeSizeBtn.getAttribute("data-size") + "ml" : "125ml";
      
      var whatsappText =
        "أرغب في طلب منتج " + nameText + " - الحجم: " + sizeText + " من MALORA Body Splash";
      var url = WHATSAPP_BASE + encodeURIComponent(whatsappText);

      window.open(url, "_blank");
    });
  });

  applyFilters();

  // سلايدر آراء العملاء
  var reviewsGrid = document.querySelector(".reviews-grid");
  var reviewCards = reviewsGrid
    ? Array.prototype.slice.call(reviewsGrid.querySelectorAll(".review-card"))
    : [];

  if (reviewsGrid && reviewCards.length > 1) {
    var currentReviewIndex = 0;
    var reviewSliderInterval = null;

    function updateReviewSlider() {
      var viewportWidth = window.innerWidth || document.documentElement.clientWidth;

      if (viewportWidth <= 768) {
        reviewsGrid.style.transform = "";
        return;
      }

      var container = reviewsGrid.parentElement;
      if (!container) {
        return;
      }

      var slideWidth = container.clientWidth;
      reviewsGrid.style.transform = "translateX(" + currentReviewIndex * -slideWidth + "px)";
    }

    function goToNextReview() {
      var viewportWidth = window.innerWidth || document.documentElement.clientWidth;

      if (viewportWidth <= 768) {
        return;
      }

      currentReviewIndex = (currentReviewIndex + 1) % reviewCards.length;
      updateReviewSlider();
    }

    function startReviewSlider() {
      if (reviewSliderInterval) return;

      reviewSliderInterval = setInterval(function () {
        goToNextReview();
      }, 4000);
    }

    function stopReviewSlider() {
      if (reviewSliderInterval) {
        clearInterval(reviewSliderInterval);
        reviewSliderInterval = null;
      }
    }

    function handleReviewResize() {
      var viewportWidth = window.innerWidth || document.documentElement.clientWidth;

      if (viewportWidth <= 768) {
        currentReviewIndex = 0;
        reviewsGrid.style.transform = "";
        stopReviewSlider();
      } else {
        updateReviewSlider();
        startReviewSlider();
      }
    }

    handleReviewResize();
    window.addEventListener("resize", handleReviewResize);
    startReviewSlider();
  }
});
