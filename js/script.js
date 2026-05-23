/* ==========================================================================
   Ultimate AI Technologies Pvt Ltd - Core Interactive Engine
   ========================================================================== */

// --- Global Estimator State ---
let selectedProjectType = 'app';
let baseCost = 40000;

document.addEventListener('DOMContentLoaded', () => {
    // 1. Navbar Scroll Control
    const navbar = document.querySelector('.navbar-wrapper');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        highlightNavLink();
    });

    // 2. Mobile Drawer Controls
    const menuToggle = document.getElementById('menu-toggle');
    const drawerClose = document.getElementById('drawer-close');
    const mobileDrawer = document.getElementById('mobile-drawer');
    const drawerLinks = document.querySelectorAll('.drawer-link');

    if (menuToggle && mobileDrawer) {
        menuToggle.addEventListener('click', () => {
            mobileDrawer.classList.add('open');
        });
    }

    if (drawerClose && mobileDrawer) {
        drawerClose.addEventListener('click', () => {
            mobileDrawer.classList.remove('open');
        });
    }

    drawerLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileDrawer.classList.remove('open');
        });
    });

    // 3. Initialize Interactive Project Estimator
    updateEstimate();

    // 4. Initialize Process Step Click Listeners
    focusProcessStep(1);
});

// --- Scroll Spy Navigation Link Highlight ---
function highlightNavLink() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSectionId = 'hero';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 120;
        if (window.scrollY >= sectionTop) {
            currentSectionId = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
            link.classList.add('active');
        }
    });
}

// --- Interactive Project Cost Calculator ---
function setProjectType(type, cost) {
    selectedProjectType = type;
    baseCost = cost;
    
    // Toggle active classes on selector buttons
    const buttons = document.querySelectorAll('.type-btn[data-type]');
    buttons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-type') === type) {
            btn.classList.add('active');
        }
    });

    updateEstimate();
}

function updateEstimate() {
    const scaleSlider = document.getElementById('project-scale');
    if (!scaleSlider) return;

    const scaleVal = parseInt(scaleSlider.value);
    
    // Features checklist math
    let addonsCost = 0;
    const features = ['feat-auth', 'feat-payment', 'feat-ai', 'feat-offline'];
    features.forEach(id => {
        const chk = document.getElementById(id);
        if (chk && chk.checked) {
            addonsCost += parseInt(chk.value);
        }
    });

    // Scale calculation & label details
    let scaleMultiplier = 1.0;
    let scaleLabel = 'Professional';
    if (scaleVal === 1) {
        scaleMultiplier = 0.8;
        scaleLabel = 'Startup MVP (0.8x)';
    } else if (scaleVal === 3) {
        scaleMultiplier = 1.6;
        scaleLabel = 'Enterprise & AI Integrated (1.6x)';
    }

    // Timelines based on project types and scale
    let baseTimeline = '4 - 6 Weeks';
    if (selectedProjectType === 'software') baseTimeline = '6 - 8 Weeks';
    else if (selectedProjectType === 'automation') baseTimeline = '2 - 3 Weeks';
    else if (selectedProjectType === 'crm') baseTimeline = '5 - 7 Weeks';

    if (scaleVal === 1) {
        baseTimeline = selectedProjectType === 'automation' ? '1 - 2 Weeks' : '3 - 4 Weeks';
    } else if (scaleVal === 3) {
        baseTimeline = selectedProjectType === 'automation' ? '4 - 5 Weeks' : '8 - 12 Weeks';
    }

    // Compute Total
    const subtotalBase = baseCost * scaleMultiplier;
    const grandTotal = subtotalBase + addonsCost;

    // Update Output Elements
    document.getElementById('breakdown-base').innerText = `₹${(baseCost).toLocaleString('en-IN')}`;
    document.getElementById('breakdown-scale').innerText = `${scaleLabel}`;
    document.getElementById('breakdown-addons').innerText = `₹${addonsCost.toLocaleString('en-IN')}`;
    document.getElementById('breakdown-timeline').innerText = baseTimeline;

    // Animate Number Counter
    animateValue('total-amount', grandTotal);
}

// Helper to animate count values
function animateValue(id, endValue) {
    const obj = document.getElementById(id);
    if (!obj) return;
    
    // Extract current number
    const startValue = parseInt(obj.innerText.replace(/,/g, '')) || 0;
    if (startValue === endValue) return;

    const duration = 400; // ms
    let startTime = null;

    function step(timestamp) {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const currentValue = Math.floor(progress * (endValue - startValue) + startValue);
        obj.innerText = currentValue.toLocaleString('en-IN');
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    }
    window.requestAnimationFrame(step);
}

// Inject details from calculator to contact form message box
function injectEstimateIntoContact() {
    const totalCostStr = document.getElementById('total-amount').innerText;
    const timelineStr = document.getElementById('breakdown-timeline').innerText;
    
    let typeName = 'Mobile App Development';
    if (selectedProjectType === 'software') typeName = 'Custom Enterprise Software';
    else if (selectedProjectType === 'automation') typeName = 'Workflow Automation Scripting';
    else if (selectedProjectType === 'crm') typeName = 'Bespoke CRM Architecture';

    // Set select box
    const serviceSelect = document.getElementById('form-service');
    if (serviceSelect) {
        serviceSelect.value = selectedProjectType;
    }

    // Append standard prompt detail into message textarea
    const messageArea = document.getElementById('form-message');
    if (messageArea) {
        messageArea.value = `Hi Ultimate AI team, I just calculated my project estimate using your interactive tool.\n\nProject Category: ${typeName}\nEstimated Budget: ₹${totalCostStr}\nExpected Timeline: ${timelineStr}\n\nI would love to set up a detailed walkthrough of this setup. Please get back to me!`;
    }
}

// --- Interactive Process Steps Panel ---
const processData = {
    1: {
        phase: "PHASE 01",
        title: "Discovery & Strategy",
        desc: "Before writing a single line of script, we analyze your workflow pipelines, document integrations, outline cybersecurity protocols, and craft a detailed development roadmap. This blueprint eliminates budget drift and guarantees clear endpoints.",
        iconClass: "fa-solid fa-compass-drafting"
    },
    2: {
        phase: "PHASE 02",
        title: "Interactive Wireframes",
        desc: "We build modern, functional wireframes and Figma layout files. You get to interact with the screens, test navigation structures, and perfect user flows. Your design feedback is integrated instantly before coding starts.",
        iconClass: "fa-solid fa-wand-magic-sparkles"
    },
    3: {
        phase: "PHASE 03",
        title: "Agile Sprint Development",
        desc: "We write robust production code organized in rapid 2-week iterations. After each cycle, we deploy functional code updates to an staging environment. You get to monitor daily progress and participate in sprint reviews.",
        iconClass: "fa-solid fa-terminal"
    },
    4: {
        phase: "PHASE 04",
        title: "Continuous QA & Launch",
        desc: "We perform strict manual testing and run continuous automated test scripts. Once all security checks, API boundaries, and responsive benchmarks pass, we handle staging-to-production deployment and deliver 24/7 post-launch monitoring.",
        iconClass: "fa-solid fa-rocket"
    }
};

function focusProcessStep(stepNum) {
    // Remove active state from all card headers
    const stepCards = document.querySelectorAll('.process-step-card');
    stepCards.forEach((card, index) => {
        card.classList.remove('active');
        if (index + 1 === stepNum) {
            card.classList.add('active');
        }
    });

    // Populate data inside Showcase View panel
    const data = processData[stepNum];
    if (data) {
        const titleEl = document.getElementById('showcase-title');
        const descEl = document.getElementById('showcase-desc');
        const badgeEl = document.querySelector('.step-num-highlight');
        const iconEl = document.getElementById('showcase-icon');

        if (titleEl) titleEl.innerText = data.title;
        if (descEl) descEl.innerText = data.desc;
        if (badgeEl) badgeEl.innerText = data.phase;
        
        if (iconEl) {
            // Replace FontAwesome class cleanly
            iconEl.className = `${data.iconClass} showcase-icon-anim`;
        }
    }
}

// --- Contact Form Submission Handler ---
function handleContactSubmit(event) {
    event.preventDefault();
    
    // Extract Form Values
    const nameVal = document.getElementById('form-name').value;
    const emailVal = document.getElementById('form-email').value;
    const serviceVal = document.getElementById('form-service').value;
    const messageVal = document.getElementById('form-message').value;

    let budgetStr = document.getElementById('total-amount').innerText;
    let timelineStr = document.getElementById('breakdown-timeline').innerText;

    // Check if the user loaded standard estimated budget details
    const isCalculatorReferenced = messageVal.includes('Estimated Budget');

    // Select suitable Founder for context feedback
    let contactFounderName = "Nimesh Sompura (CTO)";
    if (serviceVal === 'marketing' || serviceVal === 'crm') {
        contactFounderName = "Vishal Sompura (COO)";
    } else if (serviceVal === 'automation' && !isCalculatorReferenced) {
        contactFounderName = "Gaurav Govindnarayan Mishra (CEO)";
    }

    // Build success prompt
    const successAlertText = document.getElementById('success-alert-text');
    if (successAlertText) {
        let msg = `Thank you, <strong>${nameVal}</strong>! We have received your consultation ticket regarding this request. `;
        if (isCalculatorReferenced) {
            msg += `We've captured your estimated project cost of <strong>₹${budgetStr}</strong> (${timelineStr} timeline). `;
        }
        msg += `Founder <strong>${contactFounderName}</strong> will contact you via <strong>${emailVal}</strong> within the next 2 business hours to schedule your kickoff meeting.`;
        successAlertText.innerHTML = msg;
    }

    // Slide up success modal alert
    const successAlert = document.getElementById('success-alert');
    if (successAlert) {
        successAlert.classList.add('show');
    }
}

function closeSuccessAlert() {
    const successAlert = document.getElementById('success-alert');
    if (successAlert) {
        successAlert.classList.remove('show');
    }
    
    // Reset Form fields
    const form = document.getElementById('project-contact-form');
    if (form) {
        form.reset();
    }
}
