// Global JavaScript for Youth Development Website
// Handles Multi-page interactivity, dark mode, floating widgets, and dynamic modules

document.addEventListener('DOMContentLoaded', () => {
  
  // 0. --- INJECT KEYFRAME ANIMATIONS ---
  const injectGlobalStyles = () => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(6px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .animate-fade-in {
        animation: fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }
      @keyframes bounceSlow {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-8px); }
      }
      .animate-bounce-slow {
        animation: bounceSlow 3s ease-in-out infinite;
      }
    `;
    document.head.appendChild(style);
  };
  injectGlobalStyles();

  // 1. --- DARK MODE TRIGGER ---
  const initDarkMode = () => {
    const themeToggleBtn = document.getElementById('dark-theme-toggle');
    const htmlEl = document.documentElement;

    // Check saved theme - default to light if not explicitly set to 'dark'
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'dark') {
      htmlEl.classList.add('dark');
      if (themeToggleBtn) updateToggleIcon(themeToggleBtn, true);
    } else {
      htmlEl.classList.remove('dark');
      if (themeToggleBtn) updateToggleIcon(themeToggleBtn, false);
    }

    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', () => {
        const isDarkNow = htmlEl.classList.contains('dark');
        if (isDarkNow) {
          htmlEl.classList.remove('dark');
          localStorage.setItem('theme', 'light');
          updateToggleIcon(themeToggleBtn, false);
          showToast('Light Mode Active', 'Theme switched to light.', false);
        } else {
          htmlEl.classList.add('dark');
          localStorage.setItem('theme', 'dark');
          updateToggleIcon(themeToggleBtn, true);
          showToast('Dark Mode Active', 'Theme switched to dark.', false);
        }
      });
    }
  };

  const updateToggleIcon = (btn, isDark) => {
    const icon = btn.querySelector('i');
    if (!icon) return;
    if (isDark) {
      icon.className = 'fa-solid fa-sun text-yellow-400 text-lg';
    } else {
      icon.className = 'fa-solid fa-moon text-scoutGreen text-lg';
    }
  };
  initDarkMode();

  // 2. --- FLOATING STICKY CONTROLS (BACK TO TOP & FLOATING HEADER) ---
  const header = document.querySelector('header');
  const backToTopBtn = document.getElementById('back-to-top');
  const navbarContainer = document.getElementById('navbar-container');
  const brandLogoContainer = document.getElementById('brand-logo-container');

  window.addEventListener('scroll', () => {
    // Header shadow/blur and padding shrink on scroll
    if (header && navbarContainer && brandLogoContainer) {
      if (window.scrollY > 50) {
        header.classList.add('shadow-md');
        navbarContainer.classList.remove('py-3');
        navbarContainer.classList.add('py-1.5');
        brandLogoContainer.classList.remove('w-11', 'h-11', 'md:w-12', 'md:h-12');
        brandLogoContainer.classList.add('w-9', 'h-9', 'md:w-10', 'md:h-10');
      } else {
        header.classList.remove('shadow-md');
        navbarContainer.classList.remove('py-1.5');
        navbarContainer.classList.add('py-3');
        brandLogoContainer.classList.remove('w-9', 'h-9', 'md:w-10', 'md:h-10');
        brandLogoContainer.classList.add('w-11', 'h-11', 'md:w-12', 'md:h-12');
      }
    }

    // Back-to-top button visibility
    if (backToTopBtn) {
      if (window.scrollY > 400) {
        backToTopBtn.classList.remove('translate-y-20', 'opacity-0');
        backToTopBtn.classList.add('translate-y-0', 'opacity-100');
      } else {
        backToTopBtn.classList.add('translate-y-20', 'opacity-0');
        backToTopBtn.classList.remove('translate-y-0', 'opacity-100');
      }
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 3. --- HEADER SEARCH MODAL OVERLAY ---
  const searchToggle = document.getElementById('search-toggle');
  const searchModal = document.getElementById('search-modal');
  const closeSearch = document.getElementById('close-search');

  if (searchToggle && searchModal && closeSearch) {
    searchToggle.addEventListener('click', () => {
      searchModal.classList.remove('hidden');
      setTimeout(() => {
        searchModal.classList.remove('opacity-0');
        searchModal.querySelector('input')?.focus();
      }, 10);
      document.body.classList.add('overflow-hidden');
    });

    const hideSearchModal = () => {
      searchModal.classList.add('opacity-0');
      setTimeout(() => {
        searchModal.classList.add('hidden');
      }, 300);
      document.body.classList.remove('overflow-hidden');
    };

    closeSearch.addEventListener('click', hideSearchModal);
    
    // Close on backdrop click
    searchModal.addEventListener('click', (e) => {
      if (e.target === searchModal) hideSearchModal();
    });

    // Handle Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !searchModal.classList.contains('hidden')) {
        hideSearchModal();
      }
    });

    // Simulated Search Form Submission
    const searchForm = searchModal.querySelector('form');
    if (searchForm) {
      searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const query = searchForm.querySelector('input').value;
        hideSearchModal();
        showToast('Search Result', `Redirecting to search results for: "${query}"`, false);
      });
    }
  }

  // 4. --- MOBILE MENU NAVIGATION & DROPDOWNS ---
  const menuBtn = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuIcon = document.getElementById('menu-icon');

  if (menuBtn && mobileMenu && menuIcon) {
    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
      const isHidden = mobileMenu.classList.contains('hidden');
      if (isHidden) {
        menuIcon.className = 'fa-solid fa-bars text-xl md:text-2xl transition-transform duration-300';
      } else {
        menuIcon.className = 'fa-solid fa-xmark text-xl md:text-2xl transition-transform duration-300 rotate-90';
      }
    });

    // Mobile multi-level dropdown accordions
    const dropdownTriggers = mobileMenu.querySelectorAll('.mobile-dropdown-trigger');
    dropdownTriggers.forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const subMenu = trigger.nextElementSibling;
        const icon = trigger.querySelector('i');
        if (subMenu) {
          subMenu.classList.toggle('hidden');
          if (icon) {
            icon.classList.toggle('rotate-180');
          }
        }
      });
    });
  }

  // 5. --- STATS ANIMATION TRIGGER ---
  const statElements = document.querySelectorAll('[id^="stat-"]');
  if (statElements.length > 0) {
    const animateStatNumber = (el, target, suffix = '') => {
      let current = 0;
      const duration = 1500; // Total duration in ms
      const stepsCount = 60;
      const stepValue = Math.ceil(target / stepsCount);
      const stepDuration = duration / stepsCount;

      const timer = setInterval(() => {
        current += stepValue;
        if (current >= target) {
          el.textContent = target.toLocaleString() + suffix;
          clearInterval(timer);
        } else {
          el.textContent = current.toLocaleString() + suffix;
        }
      }, stepDuration);
    };

    const runAllStats = () => {
      statElements.forEach(el => {
        const targetVal = parseInt(el.getAttribute('data-target') || '0', 10);
        const suffix = el.getAttribute('data-suffix') || '';
        animateStatNumber(el, targetVal, suffix);
      });
    };

    const firstStat = statElements[0];
    if (firstStat) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            runAllStats();
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.3 });
      observer.observe(firstStat.parentElement);
    }
  }

  // 6. --- DYNAMIC TOAST ALERT SYSTEM ---
  const toast = document.getElementById('toast');
  const toastTitle = document.getElementById('toast-title');
  const toastDesc = document.getElementById('toast-desc');

  window.showToast = (title, desc, isError = false) => {
    if (!toast) return;
    toastTitle.textContent = title;
    toastDesc.textContent = desc;

    if (isError) {
      toast.className = 'fixed bottom-6 right-6 bg-red-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 z-50 transform translate-y-0 opacity-100 transition-all duration-300 border border-red-500';
    } else {
      toast.className = 'fixed bottom-6 right-6 bg-scoutGreen text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 z-50 transform translate-y-0 opacity-100 transition-all duration-300 border border-scoutGreen-light';
    }

    setTimeout(() => {
      toast.className = 'fixed bottom-6 right-6 bg-scoutGreen text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 z-50 transform translate-y-20 opacity-0 transition-all duration-300';
    }, 4000);
  };

  // Forms submissions intercept
  const standardForms = document.querySelectorAll('form:not(#search-modal form):not(#membership-reg-form):not(#membership-login-form)');
  standardForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const action = form.getAttribute('data-action-name') || 'Form Submission';
      showToast('Action Successful', `${action} has been successfully recorded.`, false);
      form.reset();
    });
  });

  // 7. --- SEARCH & FILTER (For notices.html and downloads.html) ---
  const searchInput = document.getElementById('table-search');
  const filterSelect = document.getElementById('category-filter');
  const itemsContainer = document.getElementById('filterable-container');

  if (searchInput || filterSelect) {
    const performFiltering = () => {
      const query = (searchInput?.value || '').toLowerCase().trim();
      const category = (filterSelect?.value || 'all').toLowerCase();
      
      const rows = itemsContainer?.querySelectorAll('.filterable-item') || [];
      rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        const itemCat = (row.getAttribute('data-category') || '').toLowerCase();

        const matchesQuery = text.includes(query);
        const matchesCategory = category === 'all' || itemCat === category;

        if (matchesQuery && matchesCategory) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    };

    if (searchInput) searchInput.addEventListener('input', performFiltering);
    if (filterSelect) filterSelect.addEventListener('change', performFiltering);
  }

  // 8. --- MULTI-STEP MEMBERSHIP REGISTRATION FORM ---
  const regForm = document.getElementById('membership-reg-form');
  if (regForm) {
    const steps = regForm.querySelectorAll('.form-step');
    const stepIndicators = document.querySelectorAll('.step-indicator');
    let currentStep = 0;

    const showStep = (stepIdx) => {
      steps.forEach((step, idx) => {
        if (idx === stepIdx) {
          step.classList.remove('hidden');
          setTimeout(() => step.classList.remove('opacity-0'), 10);
        } else {
          step.classList.add('hidden', 'opacity-0');
        }
      });

      // Update progress bar indicator
      stepIndicators.forEach((indicator, idx) => {
        const stepNum = indicator.querySelector('.step-num');
        const stepText = indicator.querySelector('.step-text');
        
        if (idx < stepIdx) {
          // Completed step
          if (stepNum) {
            stepNum.innerHTML = '<i class="fa-solid fa-check text-xs"></i>';
            stepNum.className = 'step-num w-8 h-8 rounded-full bg-scoutGreen text-white flex items-center justify-center font-bold transition-all';
          }
          if (stepText) stepText.className = 'step-text text-xs text-scoutGreen font-bold hidden sm:inline';
        } else if (idx === stepIdx) {
          // Current active step
          if (stepNum) {
            stepNum.textContent = idx + 1;
            stepNum.className = 'step-num w-8 h-8 rounded-full bg-scoutGold text-scoutGreen flex items-center justify-center font-extrabold ring-4 ring-scoutGold/20 transition-all';
          }
          if (stepText) stepText.className = 'step-text text-xs text-scoutGreen font-extrabold hidden sm:inline';
        } else {
          // Future step
          if (stepNum) {
            stepNum.textContent = idx + 1;
            stepNum.className = 'step-num w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-bold transition-all dark:bg-slate-800 dark:text-slate-500';
          }
          if (stepText) stepText.className = 'step-text text-xs text-gray-400 hidden sm:inline dark:text-slate-600';
        }
      });
    };

    // Attach button actions
    regForm.querySelectorAll('.btn-next').forEach(btn => {
      btn.addEventListener('click', () => {
        // Validation check for inputs in current step
        const inputs = steps[currentStep].querySelectorAll('input[required], select[required]');
        let valid = true;
        inputs.forEach(input => {
          if (!input.checkValidity()) {
            input.reportValidity();
            valid = false;
          }
        });

        if (valid) {
          currentStep++;
          showStep(currentStep);
        }
      });
    });

    regForm.querySelectorAll('.btn-prev').forEach(btn => {
      btn.addEventListener('click', () => {
        currentStep--;
        showStep(currentStep);
      });
    });

    regForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Registration Success!', 'Account created. You can now login using the credentials.', false);
      
      // Auto switch view to login tab
      const loginTabBtn = document.getElementById('login-tab-btn');
      if (loginTabBtn) {
        loginTabBtn.click();
      }
      regForm.reset();
      currentStep = 0;
      showStep(currentStep);
    });

    showStep(currentStep);
  }

  // Membership Login handler
  const loginForm = document.getElementById('membership-login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const email = document.getElementById('login-email').value;
      
      showToast('Welcome Back!', 'Login successful. Redirecting to your dashboard...', false);
      
      // Switch view to mock dashboard after delay
      setTimeout(() => {
        const dashboardSection = document.getElementById('dashboard-view');
        const portalTabs = document.getElementById('portal-tabs');
        const portalForms = document.getElementById('portal-forms-view');
        
        if (dashboardSection && portalTabs && portalForms) {
          portalTabs.classList.add('hidden');
          portalForms.classList.add('hidden');
          dashboardSection.classList.remove('hidden');
          
          // Inject user info into dashboard mockup
          document.getElementById('dashboard-member-name').textContent = email.split('@')[0].toUpperCase();
          document.getElementById('dashboard-card-name').textContent = email.split('@')[0].toUpperCase();
        }
      }, 1000);
    });
  }

  // Dashboard Signout handler
  window.signoutDashboard = () => {
    const dashboardSection = document.getElementById('dashboard-view');
    const portalTabs = document.getElementById('portal-tabs');
    const portalForms = document.getElementById('portal-forms-view');
    
    if (dashboardSection && portalTabs && portalForms) {
      dashboardSection.classList.add('hidden');
      portalTabs.classList.remove('hidden');
      portalForms.classList.remove('hidden');
      if (loginForm) loginForm.reset();
      showToast('Logged Out', 'You have been securely signed out.', false);
    }
  };

  // Dashboard Tab Switches (Forms view tabs: Register vs Login)
  window.switchPortalTab = (tabName) => {
    const regTabBtn = document.getElementById('reg-tab-btn');
    const loginTabBtn = document.getElementById('login-tab-btn');
    const regFormContainer = document.getElementById('reg-form-container');
    const loginFormContainer = document.getElementById('login-form-container');

    if (tabName === 'register') {
      regFormContainer?.classList.remove('hidden');
      loginFormContainer?.classList.add('hidden');
      
      regTabBtn.className = 'flex-1 py-3 text-center font-bold text-sm bg-scoutGreen text-white border-b-4 border-scoutGold rounded-tl-2xl';
      loginTabBtn.className = 'flex-1 py-3 text-center font-bold text-sm bg-gray-100 text-gray-500 hover:bg-gray-200/50 rounded-tr-2xl dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800';
    } else {
      regFormContainer?.classList.add('hidden');
      loginFormContainer?.classList.remove('hidden');

      regTabBtn.className = 'flex-1 py-3 text-center font-bold text-sm bg-gray-100 text-gray-500 hover:bg-gray-200/50 rounded-tl-2xl dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800';
      loginTabBtn.className = 'flex-1 py-3 text-center font-bold text-sm bg-scoutGreen text-white border-b-4 border-scoutGold rounded-tr-2xl';
    }
  };

  // 9. --- LIGHTBOX FOR MULTI-PAGE GALLERY ---
  const galleryItems = document.querySelectorAll('.gallery-grid-item');
  if (galleryItems.length > 0) {
    let currentLightboxIdx = 0;
    const itemsData = [];

    galleryItems.forEach((item, idx) => {
      const img = item.querySelector('img');
      itemsData.push({
        src: img?.getAttribute('src') || '',
        title: item.getAttribute('data-title') || 'Album Image',
        desc: item.getAttribute('data-desc') || 'Activities documentation details.'
      });

      item.addEventListener('click', () => {
        currentLightboxIdx = idx;
        openGalleryLightbox();
      });
    });

    const gLightbox = document.getElementById('gallery-lightbox');
    const gLightboxImg = document.getElementById('g-lightbox-img');
    const gLightboxTitle = document.getElementById('g-lightbox-title');
    const gLightboxDesc = document.getElementById('g-lightbox-desc');

    const openGalleryLightbox = () => {
      if (!gLightbox || !gLightboxImg) return;
      updateGalleryLightbox();
      gLightbox.classList.remove('hidden');
      setTimeout(() => gLightbox.classList.remove('opacity-0'), 10);
      document.body.classList.add('overflow-hidden');
    };

    window.closeGalleryLightbox = () => {
      if (!gLightbox) return;
      gLightbox.classList.add('opacity-0');
      setTimeout(() => gLightbox.classList.add('hidden'), 300);
      document.body.classList.remove('overflow-hidden');
    };

    window.changeGalleryLightboxSlide = (direction) => {
      currentLightboxIdx += direction;
      if (currentLightboxIdx >= itemsData.length) currentLightboxIdx = 0;
      if (currentLightboxIdx < 0) currentLightboxIdx = itemsData.length - 1;
      updateGalleryLightbox();
    };

    const updateGalleryLightbox = () => {
      const data = itemsData[currentLightboxIdx];
      if (!data || !gLightboxImg) return;
      gLightboxImg.src = data.src;
      gLightboxImg.alt = data.title;
      if (gLightboxTitle) gLightboxTitle.textContent = data.title;
      if (gLightboxDesc) gLightboxDesc.textContent = data.desc;
    };

    // Close on overlay click
    gLightbox?.addEventListener('click', (e) => {
      if (e.target === gLightbox) closeGalleryLightbox();
    });

    // Keyboard handlers
    document.addEventListener('keydown', (e) => {
      if (gLightbox && !gLightbox.classList.contains('hidden')) {
        if (e.key === 'ArrowRight') changeGalleryLightboxSlide(1);
        if (e.key === 'ArrowLeft') changeGalleryLightboxSlide(-1);
        if (e.key === 'Escape') closeGalleryLightbox();
      }
    });
  }

  // 10. --- GALLERY FILTERING FUNCTION ---
  window.filterGallery = (category) => {
    const items = document.querySelectorAll('.gallery-item');
    items.forEach(item => {
      const itemCat = item.getAttribute('data-category');
      if (category === 'all' || itemCat === category) {
        item.style.display = '';
      } else {
        item.style.display = 'none';
      }
    });

    // Update active tab button style
    const tabs = document.querySelectorAll('.gallery-tab');
    tabs.forEach(tab => {
      const onclickAttr = tab.getAttribute('onclick') || '';
      if (onclickAttr.includes(`'${category}'`)) {
        tab.className = 'gallery-tab px-5 py-2 bg-scoutGreen text-white text-xs font-bold rounded-full shadow';
      } else {
        tab.className = 'gallery-tab px-5 py-2 bg-white dark:bg-slate-800 text-gray-500 border border-gray-150 dark:border-slate-800 text-xs font-bold rounded-full hover:bg-gray-50';
      }
    });
  };

  // 11. --- NOTICE DETAIL MODAL SYSTEM ---
  const noticesData = {
    'notice-1': {
      title: 'State Level Leadership Camp - 2026',
      category: 'Camps & Training',
      date: '18 May 2026',
      venue: 'Topdara Camp Ground, Ajmer',
      content: 'A state-level leadership training camp is scheduled to take place at the Topdara Division Grounds from 1st June to 7th June 2026. This training module is mandatory for all Rover Scouts and Ranger Guides seeking Rajya Puraskar and Rashtrapati Award nominations. Registration forms can be completed online via the membership portal before the deadline of 25th May 2026. Accommodation, meals, and standard scouting kits will be provided on-site. Participants must report in full uniform with active medical fitness certificates.'
    },
    'notice-2': {
      title: 'World Environment Day Celebration',
      category: 'Activities & Drills',
      date: '12 May 2026',
      venue: 'Mass Tree Plantation Drive, Topdara Ajmer',
      content: 'World Environment Day on 5th June 2026 will be celebrated with a mass tree plantation drive around Topdara and Vinay Nagar area. Scouts and guides from all local school units are directed to participate in their respective patrols. Saplings of neem, pipal, and banyan will be provided by the Forest Department. Awards will be given to the patrol with the highest sapling survival rate over the next three months. Let us make Ajmer green!'
    },
    'notice-3': {
      title: 'Rover & Ranger Moot Registration Open',
      category: 'Camps & Training',
      date: '05 May 2026',
      venue: 'Online Portal / Ajmer HQ',
      content: 'The Annual Rover & Ranger Moot registration is now open. All qualified Rovers and Rangers in Ajmer region should register online. This event is a great opportunity to showcase pioneering skills, participate in rescue drills, and network with other units across Rajasthan. The last date to submit registration forms is 25th May 2026. Nominations must be signed by the unit leader.'
    },
    'notice-4': {
      title: 'Training Course for Scout Masters',
      category: 'Camps & Training',
      date: '28 Apr 2026',
      venue: 'Ajmer Division HQ',
      content: 'A Basic/Advanced Training Course for Scout Masters and Guide Captains is scheduled for June 2026. Nomination letters are invited from schools and colleges in the division. The course aims to update unit leaders on the latest BSG rules, safety guidelines, and badge requirements. Nomination letters should reach the division office by 20th May 2026.'
    }
  };

  const noticeModal = document.getElementById('notice-modal');
  const noticeModalContent = document.getElementById('notice-modal-content');

  window.showNoticeDetail = (noticeId) => {
    const data = noticesData[noticeId];
    if (!data || !noticeModal || !noticeModalContent) return;

    noticeModalContent.innerHTML = `
      <div class="space-y-4">
        <div class="flex justify-between items-start border-b dark:border-slate-800 pb-4">
          <div>
            <span class="text-[10px] bg-scoutGreen/10 text-scoutGreen dark:bg-slate-800 dark:text-scoutGreen-light px-2.5 py-0.5 rounded font-extrabold uppercase">${data.category}</span>
            <h3 class="font-display font-extrabold text-lg text-charcoal dark:text-white mt-2 leading-tight">${data.title}</h3>
          </div>
        </div>
        <div class="space-y-2 text-xs text-gray-500">
          <div class="flex items-center gap-1.5"><i class="fa-solid fa-calendar text-scoutGold"></i> <span><strong>Date:</strong> ${data.date}</span></div>
          <div class="flex items-center gap-1.5"><i class="fa-solid fa-location-dot text-scoutGold"></i> <span><strong>Venue:</strong> ${data.venue}</span></div>
        </div>
        <div class="text-sm text-gray-600 dark:text-slate-300 leading-relaxed pt-2">
          <p>${data.content}</p>
        </div>
      </div>
    `;

    noticeModal.classList.remove('hidden');
    setTimeout(() => {
      noticeModal.classList.remove('opacity-0');
      noticeModal.firstElementChild?.classList.remove('scale-95');
    }, 10);
    document.body.classList.add('overflow-hidden');
  };

  window.closeNoticeModal = () => {
    if (!noticeModal) return;
    noticeModal.classList.add('opacity-0');
    noticeModal.firstElementChild?.classList.add('scale-95');
    setTimeout(() => {
      noticeModal.classList.add('hidden');
    }, 300);
    document.body.classList.remove('overflow-hidden');
  };

  noticeModal?.addEventListener('click', (e) => {
    if (e.target === noticeModal) closeNoticeModal();
  });

  // 12. --- AUTOMATIC ACTIVE NAV LINK HIGHLIGHTING ---
  const highlightActiveNavLinks = () => {
    const path = window.location.pathname;
    const page = path.split('/').pop() || 'index.html';

    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu) {
      // Find all top-level mobile nav links (not inside a submenu)
      const topLevelLinks = mobileMenu.querySelectorAll('.px-4.py-6 > a, .mobile-dropdown-trigger');
      
      topLevelLinks.forEach(link => {
        const href = link.getAttribute('href') || '';
        
        // Remove existing active/inactive classes
        link.classList.remove('text-white', 'bg-scoutGreen', 'text-scoutGreen', 'bg-scoutGreen/5', 'dark:bg-scoutGreen/10', 'border-l-4', 'border-scoutGreen', 'dark:border-scoutGold', 'pl-3', 'rounded-r-lg', 'font-bold');
        link.classList.add('text-slate-800', 'dark:text-slate-200', 'hover:bg-slate-50', 'dark:hover:bg-slate-800');

        // Check if current page matches
        const isCurrentPage = (page === 'index.html' && href === 'index.html') || 
                              (page !== 'index.html' && href !== '#' && href.startsWith(page));

        if (isCurrentPage) {
          link.classList.remove('text-slate-800', 'dark:text-slate-200', 'hover:bg-slate-50', 'dark:hover:bg-slate-800');
          link.classList.add('text-scoutGreen', 'dark:text-white', 'bg-scoutGreen/5', 'dark:bg-scoutGreen/10', 'border-l-4', 'border-scoutGreen', 'dark:border-scoutGold', 'pl-3', 'rounded-r-lg', 'font-bold');
        }
      });

      // Style submenu links
      const submenuContainer = mobileMenu.querySelector('.mobile-dropdown-trigger + div');
      if (submenuContainer) {
        const submenuLinks = submenuContainer.querySelectorAll('a');
        submenuLinks.forEach(link => {
          const href = link.getAttribute('href') || '';
          
          // Clear active styles
          link.classList.remove('text-scoutGreen', 'dark:text-scoutGold', 'font-bold');
          link.classList.add('text-slate-600', 'dark:text-slate-400', 'hover:text-scoutGreen', 'dark:hover:text-white');
          
          // Check if it's active. If page is about.html:
          const currentHash = window.location.hash;
          const hrefHash = href.includes('#') ? '#' + href.split('#')[1] : '';
          
          const isHashMatch = (currentHash && hrefHash === currentHash) || (!currentHash && hrefHash === '#history');
          
          if (page.startsWith('about.html') && isHashMatch) {
            link.classList.remove('text-slate-600', 'dark:text-slate-400');
            link.classList.add('text-scoutGreen', 'dark:text-scoutGold', 'font-bold');
          }
        });
      }

      // Special case: If we are on about.html, highlight the parent ABOUT US trigger
      if (page.startsWith('about.html')) {
        const aboutTrigger = mobileMenu.querySelector('.mobile-dropdown-trigger');
        if (aboutTrigger) {
          aboutTrigger.classList.remove('text-slate-800', 'dark:text-slate-200', 'hover:bg-slate-50', 'dark:hover:bg-slate-800');
          aboutTrigger.classList.add('text-scoutGreen', 'dark:text-white', 'bg-scoutGreen/5', 'dark:bg-scoutGreen/10', 'border-l-4', 'border-scoutGreen', 'dark:border-scoutGold', 'pl-3', 'rounded-r-lg', 'font-bold');
          
          const subMenu = aboutTrigger.nextElementSibling;
          const icon = aboutTrigger.querySelector('i');
          if (subMenu) {
            subMenu.classList.remove('hidden');
            if (icon) icon.classList.add('rotate-180');
          }
        }
      }
    }
  };
  highlightActiveNavLinks();
  window.addEventListener('hashchange', highlightActiveNavLinks);
});

