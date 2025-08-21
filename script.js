const data = JSON.parse(localStorage.getItem('fridgeMate') || '{"fridge":[],"freezer":[],"pantry":[]}');

const translations = {
    en: {
        appTitle: 'FridgeMate',
        language: 'Language',
        tabFridge: 'Fridge',
        tabFreezer: 'Freezer',
        tabPantry: 'Pantry',
        fridgeTitle: 'Fridge',
        freezerTitle: 'Freezer',
        pantryTitle: 'Pantry',
        addSection: 'Add Section',
        sectionNamePlaceholder: 'Section name',
        sectionTypeShelf: 'Shelf',
        sectionTypeDoor: 'Door',
        addItem: 'Add Item',
        foodNamePlaceholder: 'Food name',
        quantityPlaceholder: 'Qty',
        delete: 'Delete'
    },
    ko: {
        appTitle: 'FridgeMate',
        language: '언어',
        tabFridge: '냉장고',
        tabFreezer: '냉동고',
        tabPantry: '식량 창고',
        fridgeTitle: '냉장고',
        freezerTitle: '냉동고',
        pantryTitle: '식량 창고',
        addSection: '섹션 추가',
        sectionNamePlaceholder: '섹션 이름',
        sectionTypeShelf: '선반',
        sectionTypeDoor: '문칸',
        addItem: '음식 추가',
        foodNamePlaceholder: '음식 이름',
        quantityPlaceholder: '수량',
        delete: '삭제'
    }
};

let currentLang = 'en';

function t(key) {
    return translations[currentLang][key] || key;
}

function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        el.textContent = t(el.dataset.i18n);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        el.placeholder = t(el.dataset.i18nPlaceholder);
    });
    document.querySelectorAll('[data-i18n-option]').forEach(el => {
        el.text = t(el.dataset.i18nOption);
    });
}

function saveData() {
    localStorage.setItem('fridgeMate', JSON.stringify(data));
}

function renderStorage(name) {
    const sectionsContainer = document.getElementById(`${name}-sections`);
    sectionsContainer.innerHTML = '';

    data[name].forEach((section, sIndex) => {
        const sectionDiv = document.createElement('div');
        sectionDiv.className = 'section';

        const title = document.createElement('h3');
        title.textContent = `${section.name} (${t('sectionType' + section.type)})`;
        sectionDiv.appendChild(title);

        const ul = document.createElement('ul');
        section.items.forEach((item, iIndex) => {
            const li = document.createElement('li');
            li.textContent = `${item.name} - ${item.quantity} - ${item.expiry}`;
            const delBtn = document.createElement('button');
            delBtn.textContent = t('delete');
            delBtn.addEventListener('click', () => {
                section.items.splice(iIndex, 1);
                saveData();
                renderStorage(name);
            });
            li.appendChild(delBtn);
            ul.appendChild(li);
        });
        sectionDiv.appendChild(ul);

        const itemForm = document.createElement('form');
        itemForm.className = 'item-form';
        itemForm.innerHTML = `
            <input name="name" placeholder="${t('foodNamePlaceholder')}" required>
            <input name="quantity" type="number" placeholder="${t('quantityPlaceholder')}" required>
            <input name="expiry" type="date" required>
            <button type="submit">${t('addItem')}</button>
        `;
        itemForm.addEventListener('submit', e => {
            e.preventDefault();
            const fd = new FormData(itemForm);
            section.items.push({
                name: fd.get('name'),
                quantity: fd.get('quantity'),
                expiry: fd.get('expiry')
            });
            itemForm.reset();
            saveData();
            renderStorage(name);
        });
        sectionDiv.appendChild(itemForm);

        sectionsContainer.appendChild(sectionDiv);
    });
}

function setupStorage(name) {
    const form = document.getElementById(`${name}-add-section`);
    form.addEventListener('submit', e => {
        e.preventDefault();
        const fd = new FormData(form);
        data[name].push({
            name: fd.get('name'),
            type: fd.get('type'),
            items: []
        });
        form.reset();
        saveData();
        renderStorage(name);
    });
    renderStorage(name);
}

function showTab(name) {
    document.querySelectorAll('.storage').forEach(div => div.style.display = 'none');
    document.getElementById(name).style.display = 'block';
}

document.querySelectorAll('#tabs button').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('#tabs button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        showTab(btn.dataset.tab);
    });
});

document.getElementById('lang-select').addEventListener('change', e => {
    currentLang = e.target.value;
    document.documentElement.lang = currentLang;
    applyTranslations();
    renderStorage('fridge');
    renderStorage('freezer');
    renderStorage('pantry');
});

setupStorage('fridge');
setupStorage('freezer');
setupStorage('pantry');
applyTranslations();
showTab('fridge');
