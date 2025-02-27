document.addEventListener('DOMContentLoaded', () => {
    let currentStep = 1;
    let userType = null;
    const steps = document.querySelectorAll('.step');
    const progressSteps = document.querySelectorAll('.progress-step');

    // Step 1: User Type Selection
    document.querySelectorAll('.user-card').forEach(card => {
        card.addEventListener('click', () => {
            document.querySelectorAll('.user-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            userType = card.dataset.type;
            document.querySelector('.next-step').disabled = false;
        });
    });

    // Navigation Controls
    document.querySelectorAll('.next-step').forEach(button => {
        button.addEventListener('click', nextStep);
    });

    document.querySelectorAll('.back-btn').forEach(button => {
        button.addEventListener('click', prevStep);
    });

    // Form Submission
    document.querySelector('form').addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {
            userType,
            ...Object.fromEntries(formData)
        };
        console.log('Form Data:', data);
        // Add your submission logic here
        alert('Account created successfully!');
        window.location.href = 'index.html';
    });

    function nextStep() {
        if(currentStep >= 3) return;
        if(!validateStep(currentStep)) return;

        // Show role-specific fields in step 3
        if(currentStep === 2) {
            document.querySelectorAll('.role-fields').forEach(field => field.classList.remove('active'));
            document.querySelector(`.${userType}-fields`).classList.add('active');
        }

        steps[currentStep - 1].classList.remove('active');
        currentStep++;
        steps[currentStep - 1].classList.add('active');
        updateProgress();
    }

    function prevStep() {
        if(currentStep <= 1) return;
        steps[currentStep - 1].classList.remove('active');
        currentStep--;
        steps[currentStep - 1].classList.add('active');
        updateProgress();
    }

    function validateStep(step) {
        const currentForm = steps[step - 1].querySelector('form');
        if(!currentForm) return true;
        return currentForm.checkValidity();
    }

    function updateProgress() {
        progressSteps.forEach((step, index) => {
            step.classList.toggle('active', index < currentStep);
        });
    }
});