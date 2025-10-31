// --- 1. 데이터 준비 (CSV에서 변환) ---
const chamberData = [
    {"model": "203-항온항습-ARS0390-1호", "w": 700, "h": 700, "d": 800},
    {"model": "203-항온항습-ARS0390-2호", "w": 700, "h": 700, "d": 800},
    {"model": "203-항온항습-2CA-3호", "w": 609, "h": 749, "d": 600},
    {"model": "203-항온항습-2CA-2호", "w": 609, "h": 749, "d": 600},
    {"model": "203-항온항습-LHU-1호", "w": 500, "h": 599, "d": 390},
    {"model": "203-항온항습-LHU-2호", "w": 500, "h": 599, "d": 390},
    {"model": "203-항온항습-LHU-3호", "w": 500, "h": 599, "d": 390},
    {"model": "203-항온항습-ATT", "w": 601, "h": 545, "d": 692},
    {"model": "203-항온항습-2CA-1호", "w": 609, "h": 749, "d": 600},
    {"model": "203-항온항습-2K", "w": 609, "h": 749, "d": 600},
    {"model": "204-항온항습-662-1호", "w": 400, "h": 400, "d": 400},
    {"model": "204-항온항습-662-2호", "w": 400, "h": 400, "d": 400},
    {"model": "204-항온항습-662-3호", "w": 400, "h": 400, "d": 400},
    {"model": "204-항온항습-662-4호", "w": 400, "h": 400, "d": 400},
    {"model": "204-항온항습-641신-1호", "w": 400, "h": 400, "d": 400},
    {"model": "204-항온항습-641신-2호", "w": 400, "h": 400, "d": 400},
    {"model": "204-항온항습-641구-2호", "w": 400, "h": 400, "d": 400},
    {"model": "204-항온항습-641신-3호", "w": 400, "h": 400, "d": 400},
    {"model": "204-항온항습-641구-1호", "w": 400, "h": 400, "d": 400}
];

// --- 2. HTML 요소 연결 ---
const inputW = document.getElementById('sample-w');
const inputD = document.getElementById('sample-d');
const inputH = document.getElementById('sample-h');
const searchButton = document.getElementById('search-btn');
const resultArea = document.getElementById('result-area');

// --- 3. 최대 적재량 계산 함수 ---
function calculateMaxFit(chamber, sample) {
    const { w: cw, d: cd, h: ch } = chamber;
    const { w: sw, d: sd, h: sh } = sample;

    // 0으로 나누는 것을 방지
    if (sw === 0 || sd === 0 || sh === 0) return 0;

    const calculateLayout = (cw, cd, ch, sw, sd, sh) => {
        return Math.floor(cw / sw) * Math.floor(cd / sd) * Math.floor(ch / sh);
    };
    
    // 6가지 방향으로 시료를 회전시켜 최대값을 계산
    const counts = [
        calculateLayout(cw, cd, ch, sw, sd, sh),
        calculateLayout(cw, cd, ch, sw, sh, sd),
        calculateLayout(cw, cd, ch, sd, sw, sh),
        calculateLayout(cw, cd, ch, sd, sh, sw),
        calculateLayout(cw, cd, ch, sh, sw, sd),
        calculateLayout(cw, cd, ch, sh, sd, sw)
    ];

    return Math.max(...counts);
}


// --- 4. '검색하기' 버튼 클릭 이벤트 설정 ---
searchButton.addEventListener('click', function() {
    // 4.1. 사용자 입력값 가져오기
    const sampleW = parseInt(inputW.value) || 0;
    const sampleD = parseInt(inputD.value) || 0;
    const sampleH = parseInt(inputH.value) || 0;

    // 4.2. 유효성 검사
    if (sampleW <= 0 || sampleD <= 0 || sampleH <= 0) {
        alert("시료의 가로(W), 깊이(D), 높이(H)를 모두 올바르게 입력해주세요. (숫자는 0보다 커야 합니다)");
        return; 
    }

    // --- 5. 핵심 로직 (적합성 판별 및 적재량 계산) ---
    const REQUIRED_CLEARANCE = 30;
    const totalAddedSpace = REQUIRED_CLEARANCE * 2;

    const requiredChamberW = sampleW + totalAddedSpace;
    const requiredChamberD = sampleD + totalAddedSpace;
    const requiredChamberH = sampleH + totalAddedSpace;

    let passList = [];
    let failList = [];

    chamberData.forEach(chamber => {
        let failReasons = [];
        if (chamber.w < requiredChamberW) failReasons.push("가로(W)");
        if (chamber.d < requiredChamberD) failReasons.push("깊이(D)");
        if (chamber.h < requiredChamberH) failReasons.push("높이(H)");

        if (failReasons.length === 0) {
            const fitCount = calculateMaxFit(chamber, { w: sampleW, d: sampleD, h: sampleH });
            passList.push({ model: chamber.model, fitCount: fitCount });
        } else {
            failList.push({
                model: chamber.model,
                reason: failReasons.join(', ') + " 공간 부족"
            });
        }
    });

    // --- 6. 결과 출력 (HTML 생성) ---
    let resultHTML = `
        <div class="result-report">
            <h3>🔔 시료 크기 (W: ${sampleW}mm, D: ${sampleD}mm, H: ${sampleH}mm) 기준</h3>
            <hr>
            <ul class="result-list pass">
                <h4>✅ 적합한 항온항습기 (총 ${passList.length}개)</h4>
    `;
    if (passList.length > 0) {
        passList.forEach(item => {
            resultHTML += `
                <li>
                    <span>${item.model}</span>
                    <span class="fit-count">(최대 ${item.fitCount}개 적재 가능)</span>
                </li>`;
        });
    } else {
        resultHTML += `<li class="no-result">적합한 장비가 없습니다.</li>`;
    }
    resultHTML += `</ul><hr>`;

    resultHTML += `<ul class="result-list fail"><h4>❌ 부적합한 항온항습기 (총 ${failList.length}개)</h4>`;
    if (failList.length > 0) {
        failList.forEach(item => {
            resultHTML += `
                <li>
                    <span>${item.model}</span>
                    <span class="reason">(사유: ${item.reason})</span>
                </li>`;
        });
    } else {
        resultHTML += `<li class="no-result">모든 장비가 적합합니다.</li>`;
    }
    resultHTML += `</ul></div>`;

    resultArea.innerHTML = resultHTML;
    resultArea.style.display = 'block';
});
