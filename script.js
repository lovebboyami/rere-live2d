
    
    // 리깅 작가 선택 토글
    function toggleRigging(card) {
        const checkbox = card.querySelector('.rigging-checkbox');
        // 토글
        const isChecked = !checkbox.checked;
        
        // 단일 선택 (원한다면 유지, 다중 선택이면 이 부분 삭제)
        document.querySelectorAll('.rigging-checkbox').forEach(cb => {
            cb.checked = false;
            cb.closest('.rigging-card').classList.remove('selected');
        });

        if(isChecked) {
            checkbox.checked = true;
            card.classList.add('selected');
        }
        calc();
    }

    // 수량 조절 버튼
    function updateQty(btn, change) {
        const input = btn.parentElement.querySelector('.qty-input');
        let val = parseInt(input.value) || 0;
        val += change;
        if(val < 0) val = 0;
        input.value = val;
        calc();
    }

    // 포맷 함수 (숫자에 콤마)
    function fmt(num) {
        return num.toLocaleString() + "원";
    }

    // 실시간 계산 및 양식 생성
    function calc() {
        let total = 0;
        let categories = { "일러스트": [], "추가 요소": [], "기타": [], "저작권": [] };
        let selectedRigging = null;

        // 리깅 확인
        const rigCheck = document.querySelector('.rigging-checkbox:checked');
        if(rigCheck) {
            selectedRigging = rigCheck.closest('.rigging-card').getAttribute('data-name');
        }

        // 옵션 확인
        const rows = document.querySelectorAll('.opt-row');
        rows.forEach(row => {
            const input = row.querySelector('.qty-input');
            const qty = parseInt(input.value) || 0;
            const price = parseInt(row.getAttribute('data-price'));
            const name = row.getAttribute('data-name');
            const cat = row.getAttribute('data-category');

            if(qty > 0) {
                row.classList.add('active');
                let sum = price * qty;
                total += sum;
                if(categories[cat]) {
                    categories[cat].push(`- ${name} X ${qty} = ${fmt(sum)}`);
                }
            } else {
                row.classList.remove('active');
            }
        });

        // 텍스트 가져오기
        const nick = document.getElementById('in-nickname').value || "미작성";
        const concept = document.getElementById('in-concept').value || "미작성";
        const req = document.getElementById('in-req').value || "미작성";

        // 양식 조립
        let previewHTML = "";

        previewHTML += `<선택 옵션>\n\n`;

        if(selectedRigging) {
            previewHTML += `[리깅]\n- ${selectedRigging}\n\n`;
        }

        for (let cat in categories) {
            if(categories[cat].length > 0) {
                previewHTML += `[${cat}]\n${categories[cat].join('\n')}\n\n`;
            }
        }

        previewHTML += `[합계]\n- ${fmt(total)}\n\n`;
        previewHTML += `-------------------------\n`;
        previewHTML += `<문의 내용>\n\n`;
        previewHTML += `방송 닉네임, 방송 플랫폼 :\n${nick}\n\n`;
        previewHTML += `캐릭터 컨셉 :\n${concept}\n\n`;
        previewHTML += `기타 요청사항 :\n${req}`;
        document.getElementById('preview-area').innerText = previewHTML;
    }

    // 양식 복사
    function copyForm() {
        const text = document.getElementById('preview-area').innerText;
        navigator.clipboard.writeText(text).then(() => {
            alert("신청 양식이 복사되었습니다. 문의 시 붙여넣기 해주세요!");
        });
    }

    // 초기화
    function resetForm() {
        document.querySelectorAll('.qty-input').forEach(el => el.value = 0);
        document.querySelectorAll('.rigging-checkbox').forEach(el => el.checked = false);
        document.querySelectorAll('.opt-row, .rigging-card').forEach(el => el.classList.remove('active', 'selected'));
        document.getElementById('in-nickname').value = "";
        document.getElementById('in-concept').value = "";
        document.getElementById('in-req').value = "";
        calc();
    }

    
    
    // 초기 계산 실행
    calc();

function openViewer(element) {

    const oldViewer = document.querySelector('.inline-viewer');

    if(oldViewer){
        const oldCard = oldViewer.dataset.cardIndex;
        const nowCard = [...element.closest('.gallery-grid').querySelectorAll('.card')].indexOf(element.closest('.card'));

        if(oldCard == nowCard){
            oldViewer.remove();
            return;
        }

        oldViewer.remove();
    }

    const images = element.dataset.images.split(',');

    const viewer = document.createElement('div');
    viewer.className = 'inline-viewer';
    viewer.dataset.cardIndex = [...element.closest('.gallery-grid').querySelectorAll('.card')].indexOf(element.closest('.card'));

    const close = document.createElement('button');
    close.className = 'inline-close';
    close.innerHTML = '×';
    close.onclick = () => viewer.remove();

    viewer.appendChild(close);

    images.forEach(src=>{
        const img=document.createElement('img');
        img.src=src.trim();
        viewer.appendChild(img);
    });

    const grid = element.closest('.gallery-grid');
    const cards = [...grid.querySelectorAll('.card')];
    const index = cards.indexOf(element.closest('.card'));
    const column = window.innerWidth <= 768 ? 1 : 3;
    const insertTarget = cards[Math.min(index - (index % column) + (column - 1), cards.length - 1)];
    insertTarget.after(viewer);
}