const data = JSON.parse(localStorage.getItem('fridgeMate') || '{"fridge":[],"freezer":[],"pantry":[]}');

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
        title.textContent = `${section.name} (${section.type})`;
        sectionDiv.appendChild(title);

        const ul = document.createElement('ul');
        section.items.forEach((item, iIndex) => {
            const li = document.createElement('li');
            li.textContent = `${item.name} - ${item.quantity} - ${item.expiry}`;
            const delBtn = document.createElement('button');
            delBtn.textContent = 'Delete';
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
            <input name="name" placeholder="Food name" required>
            <input name="quantity" type="number" placeholder="Qty" required>
            <input name="expiry" type="date" required>
            <button type="submit">Add Item</button>
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

function setupStorage(name, allowDoor = true) {
    const form = document.getElementById(`${name}-add-section`);
    if (!allowDoor) {
        const select = form.querySelector('select');
        select.innerHTML = '<option value="Shelf">Shelf</option>';
    }
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

setupStorage('fridge', true);
setupStorage('freezer', true);
setupStorage('pantry', false);
showTab('fridge');
