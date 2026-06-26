
    
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

// ==================== 아트머그 iframe 전용 이미지 뷰어 스크립트 ====================

function openViewer(element) {
    // 1. 해당 썸네일에 지정된 이미지 문자열(data-images)을 가져와서 배열로 쪼갭니다.
    const imageString = element.getAttribute('data-images');
    if (!imageString) return;
    const images = imageString.split(',');

    const viewer = document.getElementById('artmugViewer');
    const content = document.getElementById('artmugViewerContent');

    // 2. 기존에 뷰어에 들어있던 이미지 잔상들을 깔끔하게 지웁니다.
    content.innerHTML = '';

    // 3. 배열에 들어있는 이미지들을 차례대로 <img> 태그로 만들어서 넣어줍니다.
    images.forEach(src => {
        const img = document.createElement('img');
        img.src = src.trim(); // 공백 제거
        content.appendChild(img);
    });

    // 4. [아트머그 핵심 해결] 현재 부모/현재 창의 스크롤 위치(Y축)를 계산합니다.
    const currentScrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;

    // 5. 뷰어의 시작 탑(top) 위치를 사용자가 보던 화면 위치로 딱 맞춰 띄웁니다.
    viewer.style.top = currentScrollY + 'px';
    viewer.style.display = 'block';

    // 6. [조건 5 만족] 이전에 발가락을 봤더라도 새 뷰어를 열 때는 무조건 스크롤을 맨 위(정수리)로 초기화합니다.
    content.scrollTop = 0;

    // 7. 본문 스크롤을 잠가서 상세페이지 위치가 고정되도록 만듭니다.
    document.body.classList.add('viewer-open');
}

function closeViewer() {
    const viewer = document.getElementById('artmugViewer');
    
    // 1. 뷰어 창을 화면에서 숨깁니다.
    viewer.style.display = 'none';

    // 2. [조건 4 만족] 본문 잠금을 해제하여 의뢰인이 보던 상세페이지 위치를 그대로 유지시킵니다.
    document.body.classList.remove('viewer-open');
}