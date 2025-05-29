document.addEventListener("DOMContentLoaded", () => {
    // Навигация «Далее»
    document.querySelectorAll(".next-btn").forEach(btn =>
      btn.addEventListener("click", onNext)
    );
    // Навигация «Назад»
    document.querySelectorAll(".back-btn").forEach(btn =>
      btn.addEventListener("click", onBack)
    );
  });
  
  function onNext(evt) {
    const btn = evt.currentTarget;
    const cur = btn.closest(".scene");
    const nxt = document.getElementById(btn.dataset.next);
    if (!cur || !nxt) return;
  
    cur.classList.replace("active", "hidden");
    nxt.classList.replace("hidden", "active");
  
    switch (nxt.id) {
      case "scene-2": setupKeyInput();     break;
      case "scene-3": initPC1Scene();      break;
      case "scene-4": setupSplitScene();   break;
      case "scene-5": setupShiftScene();   break;
      case "scene-6": setupPC2Scene();     break;
      case "scene-7": setupFinalScene(); break;
      case "scene-8": setupScene8(); break;
      case "scene-9": setupScene9();     break;
      case "scene-10": setupScene10(); break;
      case "scene-12": setupScene12(); break;
    }
  }
  
  function onBack(evt) {
    const btn  = evt.currentTarget;
    const cur  = btn.closest(".scene");
    const prev = document.getElementById(btn.dataset.prev);
    if (!cur || !prev) return;
  
    cur.classList.replace("active", "hidden");
    prev.classList.replace("hidden", "active");
  }
  
  // ===== Таблицы и состояния =====
  const pc1Table = [
    57,49,41,33,25,17,9, 1,58,50,42,34,26,18,
    10,2,59,51,43,35,27,19,11,3,60,52,44,36,
    63,55,47,39,31,23,15,7,62,54,46,38,30,22,
    14,6,61,53,45,37,29,21,13,5,28,20,12,4
  ];
  const shiftTable = [1,1,2,2,2,2,2,2,1,2,2,2,2,2,2,1];
  const pc2Table = [
    14,17,11,24,1,5,3,28,15,6,21,10,23,19,12,4,
    26,8,16,7,27,20,13,2,41,52,31,37,47,55,30,40,
    51,45,33,48,44,49,39,56,34,53,46,42,50,36,29,32
  ];

  // ===== Initial Permutation (IP) для сцены 8 =====
const IP = [
    58,50,42,34,26,18,10,2,
    60,52,44,36,28,20,12,4,
    62,54,46,38,30,22,14,6,
    64,56,48,40,32,24,16,8,
    57,49,41,33,25,17,9,1,
    59,51,43,35,27,19,11,3,
    61,53,45,37,29,21,13,5,
    63,55,47,39,31,23,15,7
   ];
   
   // ===== Таблица расширения E (32 → 48) =====
const E = [
    32,  1,  2,  3,  4,  5,
     4,  5,  6,  7,  8,  9,
     8,  9, 10, 11, 12, 13,
    12, 13, 14, 15, 16, 17,
    16, 17, 18, 19, 20, 21,
    20, 21, 22, 23, 24, 25,
    24, 25, 26, 27, 28, 29,
    28, 29, 30, 31, 32,  1
   ];
   const IP_EXPAND = E;
   
   // ===== S-блоки (8 штук, каждая 4×16) =====
   const SBoxes = [
     // S1
     [[14,4,13,1,2,15,11,8,3,10,6,12,5,9,0,7],
      [0,15,7,4,14,2,13,1,10,6,12,11,9,5,3,8],
      [4,1,14,8,13,6,2,11,15,12,9,7,3,10,5,0],
      [15,12,8,2,4,9,1,7,5,11,3,14,10,0,6,13]],
     // S2
     [[15,1,8,14,6,11,3,4,9,7,2,13,12,0,5,10],
      [3,13,4,7,15,2,8,14,12,0,1,10,6,9,11,5],
      [0,14,7,11,10,4,13,1,5,8,12,6,9,3,2,15],
      [13,8,10,1,3,15,4,2,11,6,7,12,0,5,14,9]],
     // S3
     [[10,0,9,14,6,3,15,5,1,13,12,7,11,4,2,8],
      [13,7,0,9,3,4,6,10,2,8,5,14,12,11,15,1],
      [13,6,4,9,8,15,3,0,11,1,2,12,5,10,14,7],
      [1,10,13,0,6,9,8,7,4,15,14,3,11,5,2,12]],
     // S4
     [[7,13,14,3,0,6,9,10,1,2,8,5,11,12,4,15],
      [13,8,11,5,6,15,0,3,4,7,2,12,1,10,14,9],
      [10,6,9,0,12,11,7,13,15,1,3,14,5,2,8,4],
      [3,15,0,6,10,1,13,8,9,4,5,11,12,7,2,14]],
     // S5
     [[2,12,4,1,7,10,11,6,8,5,3,15,13,0,14,9],
      [14,11,2,12,4,7,13,1,5,0,15,10,3,9,8,6],
      [4,2,1,11,10,13,7,8,15,9,12,5,6,3,0,14],
      [11,8,12,7,1,14,2,13,6,15,0,9,10,4,5,3]],
     // S6
     [[12,1,10,15,9,2,6,8,0,13,3,4,14,7,5,11],
      [10,15,4,2,7,12,9,5,6,1,13,14,0,11,3,8],
      [9,14,15,5,2,8,12,3,7,0,4,10,1,13,11,6],
      [4,3,2,12,9,5,15,10,11,14,1,7,6,0,8,13]],
     // S7
     [[4,11,2,14,15,0,8,13,3,12,9,7,5,10,6,1],
      [13,0,11,7,4,9,1,10,14,3,5,12,2,15,8,6],
      [1,4,11,13,12,3,7,14,10,15,6,8,0,5,9,2],
      [6,11,13,8,1,4,10,7,9,5,0,15,14,2,3,12]],
     // S8
     [[13,2,8,4,6,15,11,1,10,9,3,14,5,0,12,7],
      [1,15,13,8,10,3,7,4,12,5,6,11,0,14,9,2],
      [7,11,4,1,9,12,14,2,0,6,10,13,15,3,5,8],
      [2,1,14,7,4,10,8,13,15,12,9,0,3,5,6,11]]
   ];
   
   // ===== Таблица P (32→32) =====
   const P = [
    16, 7,20,21,29,12,28,17,
     1,15,23,26,5,18,31,10,
     2, 8,24,14,32,27,3, 9,
    19,13,30,6,22,11,4,25
   ];

   // ===== Финальная перестановка IP⁻¹ =====
const IP_INV = [
    40,8,48,16,56,24,64,32,
    39,7,47,15,55,23,63,31,
    38,6,46,14,54,22,62,30,
    37,5,45,13,53,21,61,29,
    36,4,44,12,52,20,60,28,
    35,3,43,11,51,19,59,27,
    34,2,42,10,50,18,58,26,
    33,1,41,9,49,17,57,25
  ];
  
   

  // ===== Конфигурация анимации PC-2 (сцена 6) =====
const pc2Config = {
    flightDuration: 0.3, // секунда на перелёт (меньше — быстрее)
    stepDelay:      50   // мс между шагами (меньше — быстрее)
  };
  
  
  let currentPC1Step = 0;
  let pc1Values      = [];
  let shiftRound     = 1;
  let cArr           = [];
  let dArr           = [];
  let keyGenIndex    = 1;
  let generatedKeys  = [];
  
  // ===== Сцена 2: ввод 64-битного ключа =====
  function setupKeyInput() {
    const inp  = document.getElementById("keyInput");
    const grid = document.getElementById("bitGrid");
    inp.value = "";
    grid.innerHTML = "";
    inp.oninput = () => {
      const v = inp.value.trim();
      grid.innerHTML = "";
      for (let i = 0; i < 64; i++) {
        const bit = v[i] || "0";
        const cell = document.createElement("div");
        cell.className = "bit-cell " + (((i+1)%8===0) ? "bit-gray" : "bit-green");
        cell.textContent = bit;
        grid.appendChild(cell);
      }
    };
  }
  
  // ===== Сцена 3: PC-1 перестановка =====
  function initPC1Scene() {
    currentPC1Step = 0;
    pc1Values = [];
  
    const raw = document
      .getElementById("keyInput")
      .value.trim()
      .padEnd(64, "0");
  
    const tbl = document.getElementById("pc1Table");
    const grd = document.getElementById("pc1Grid");
    tbl.innerHTML = "";
    grd.innerHTML = "";
  
    // Таблица номеров PC-1
    pc1Table.forEach(n => {
      const d = document.createElement("div");
      d.textContent = n;
      tbl.appendChild(d);
    });
  
    // Исходные 64 бита
    const orig = document.createElement("div");
    orig.id = "originalBits";
    orig.className = "bit-grid";
    raw.split("").forEach((b,i) => {
      const c = document.createElement("div");
      c.className = "bit-cell " + (((i+1)%8===0) ? "bit-gray" : "bit-green");
      c.textContent = b;
      orig.appendChild(c);
    });
  
    // Результирующие 56 пустых ячеек
    const res = document.createElement("div");
    res.id = "pc1Result";
    res.className = "bit-grid";
    for (let i = 0; i < 56; i++) {
      const c = document.createElement("div");
      c.className = "bit-cell bit-gray";
      res.appendChild(c);
    }
  
    // Кнопка шага
    const stepBtn = document.createElement("button");
    stepBtn.textContent = "Следующий шаг";
    stepBtn.className = "next-btn";
    stepBtn.onclick = doPC1Step;
  
    grd.append(orig, res, stepBtn);
  }
  
  function doPC1Step() {
    if (currentPC1Step >= pc1Table.length) {
      document.getElementById("scene3NextBtn").classList.remove("hidden");
      this.disabled = true;
      return;
    }
  
    const fromIdx = pc1Table[currentPC1Step] - 1;
    const toIdx   = currentPC1Step;
    const srcs    = document.querySelectorAll("#originalBits .bit-cell");
    const dsts    = document.querySelectorAll("#pc1Result .bit-cell");
    const src     = srcs[fromIdx];
    const dst     = dsts[toIdx];
    const v       = src.textContent;
  
    pc1Values.push(v);
  
    // Анимация «летящей» ячейки
    const wrapBox = document.getElementById("pc1Grid").getBoundingClientRect();
    const sBox    = src.getBoundingClientRect();
    const dBox    = dst.getBoundingClientRect();

    // перед клонированием делаем glow на src
src.classList.add('glow');
setTimeout(() => src.classList.remove('glow'), 600);


    const flyer   = src.cloneNode(true);
    flyer.classList.add("moving-bit");
    flyer.style.left = (sBox.left - wrapBox.left) + "px";
    flyer.style.top  = (sBox.top  - wrapBox.top)  + "px";
    document.getElementById("pc1Grid").appendChild(flyer);
    requestAnimationFrame(() => {
      flyer.style.transform = `translate(${dBox.left - sBox.left}px,${dBox.top - sBox.top}px)`;
    });
    flyer.addEventListener("transitionend", () => {
      flyer.remove();
      dst.textContent = v;
      dst.classList.replace("bit-gray","bit-green");
    }, { once:true });
  
    currentPC1Step++;
  }
  
  // ===== Сцена 4: деление на C0/D0 =====
  function setupSplitScene() {
    const wrap = document.getElementById("splitContainer");
    const srcG = document.getElementById("scene4Grid");
    const cG   = document.getElementById("gridC");
    const dG   = document.getElementById("gridD");
    const animB= document.getElementById("splitAnimateBtn");
    const nextB= document.getElementById("scene4NextBtn");
  
    srcG.innerHTML = "";
    cG.innerHTML   = "";
    dG.innerHTML   = "";
    nextB.classList.add("hidden");
    animB.disabled = false;
  
    // Показываем 56 бит
    pc1Values.forEach(bit => {
      const cell = document.createElement("div");
      cell.className = "bit-cell bit-green";
      cell.textContent = bit;
      srcG.appendChild(cell);
    });
    // Создаём C0 и D0
    for (let i = 0; i < 28; i++) {
      const cCell = document.createElement("div");
      cCell.className = "bit-cell bit-gray";
      cG.appendChild(cCell);
      const dCell = document.createElement("div");
      dCell.className = "bit-cell bit-gray";
      dG.appendChild(dCell);
    }
  
    // Анимация «разделения»
    animB.onclick = () => {
      pc1Values.forEach((bit,i) => {
        setTimeout(() => {
          const src = srcG.children[i];

          src.classList.add('glow');
          setTimeout(() => src.classList.remove('glow'), 600);
          

          const dstContainer = (i < 28 ? cG : dG);
          const dstIndex     = (i < 28 ? i : i - 28);
          const dst = dstContainer.children[dstIndex];
  
          const wrapBox = wrap.getBoundingClientRect();
          const sBox    = src.getBoundingClientRect();
          const dBox    = dst.getBoundingClientRect();
          const flyer   = src.cloneNode(true);
  
          flyer.classList.add("moving-bit");
          flyer.style.left = (sBox.left - wrapBox.left) + "px";
          flyer.style.top  = (sBox.top  - wrapBox.top)  + "px";
          wrap.appendChild(flyer);
  
          requestAnimationFrame(() => {
            flyer.style.transform = `translate(${dBox.left - sBox.left}px,${dBox.top - sBox.top}px)`;
          });
          flyer.addEventListener("transitionend", () => {
            flyer.remove();
            dst.textContent = bit;
            dst.classList.replace("bit-gray", (i<28 ? "c-bit" : "d-bit"));
          }, { once:true });
  
          if (i === pc1Values.length - 1) {
            setTimeout(() => nextB.classList.remove("hidden"), 600);
          }
        }, i * 150);
      });
      animB.disabled = true;
    };
  }
  
  // ===== Функции прогресса для Сцены 5 =====
  function updateShiftProgress(round) {
    const total = shiftTable.length; // 16
    const pct   = Math.round((round / total) * 100);
    document.getElementById("shiftProgressBar").style.width = pct + "%";
    document.getElementById("shiftProgressText").textContent = `Раунд ${round} из ${total}`;
  }
  
  // ===== Сцена 5: циклические сдвиги C/D =====
  function setupShiftScene() {
    shiftRound = 1;
    cArr = pc1Values.slice(0,28);
    dArr = pc1Values.slice(28);
  
    const tbl   = document.getElementById("shiftTable");
    const cG    = document.getElementById("cGrid");
    const dG    = document.getElementById("dGrid");
    const stepB = document.getElementById("shiftStepBtn");
    const nextB = document.getElementById("scene5NextBtn");
  
    tbl.innerHTML = "";
    cG.innerHTML  = "";
    dG.innerHTML  = "";
    nextB.classList.add("hidden");
    stepB.disabled = false;
  
    // Рисуем таблицу сдвигов
    shiftTable.forEach(n => {
      const div = document.createElement("div");
      div.textContent = n;
      tbl.appendChild(div);
    });
  
    // Начальный вывод C0 и D0
    cArr.forEach(bit => {
      const cell = document.createElement("div");
      cell.className = "bit-cell c-bit";
      cell.textContent = bit;
      cG.appendChild(cell);
    });
    dArr.forEach(bit => {
      const cell = document.createElement("div");
      cell.className = "bit-cell d-bit";
      cell.textContent = bit;
      dG.appendChild(cell);
    });
  
    // Сброс прогресса
    updateShiftProgress(0);
  
    stepB.onclick = doShiftStep;
  }
  
  function doShiftStep() {
    const total = shiftTable.length;
    if (shiftRound > total) {
      this.disabled = true;
      document.getElementById("scene5NextBtn").classList.remove("hidden");
      return;
    }
  
    // Обновляем прогресс
    updateShiftProgress(shiftRound);
  
    // Подсветка текущего раунда в таблице
    document.querySelectorAll("#shiftTable div").forEach((d,i) => {
      d.classList.toggle("shift-current", i === shiftRound-1);
    });
  
    // Анимация сдвига
    animateShift("cGrid", cArr, shiftTable[shiftRound-1], "c-bit");
    animateShift("dGrid", dArr, shiftTable[shiftRound-1], "d-bit");
  
    shiftRound++;
  }
  
  function animateShift(gridId, arr, count, bitClass) {
    const wrap = document.getElementById("shiftGrid");
    const grid = document.getElementById(gridId);
  
    for (let i = 0; i < count; i++) {
      const first = grid.children[0];

      first.classList.add('glow');
      setTimeout(() => first.classList.remove('glow'), 600);
      

      const last  = grid.children[grid.children.length-1];
      const flyer = first.cloneNode(true);
      flyer.classList.add("moving-bit");
  
      const wrapBox = wrap.getBoundingClientRect();
      const fBox    = first.getBoundingClientRect();
      const lBox    = last.getBoundingClientRect();
  
      flyer.style.left = (fBox.left - wrapBox.left) + "px";
      flyer.style.top  = (fBox.top  - wrapBox.top)  + "px";
      wrap.appendChild(flyer);
  
      requestAnimationFrame(() => {
        flyer.style.transform = `translate(${lBox.left - fBox.left}px,${lBox.top - fBox.top}px)`;
      });
      flyer.addEventListener("transitionend", () => flyer.remove(), { once:true });
  
      arr.push(arr.shift());
    }
  
    // Перерисовать после всех перелётов
    setTimeout(() => {
      grid.innerHTML = "";
      arr.forEach(bit => {
        const cell = document.createElement("div");
        cell.className = "bit-cell " + bitClass;
        cell.textContent = bit;
        grid.appendChild(cell);
      });
    }, count * 200);
  }
  
// ===== Сцена 6: PC-2 с кнопкой «Пропустить анимацию» =====
// ===== Сцена 6: PC-2 с кнопками «Следующий ключ» и «Пропустить анимацию» =====
function setupPC2Scene() {
    // Инициализация счётчика и массива
    if (typeof keyGenIndex !== "number" || keyGenIndex < 1) keyGenIndex = 1;
    if (keyGenIndex === 1) generatedKeys = [];
  
    // Получаем C и D (обратите внимание, что cArr и dArr уже изменены предыдущими сценами)
    const cdNow = cArr.concat(dArr);
  
    // DOM-узлы
    const gridCD    = document.getElementById("scene6CD");
    const gridKey   = document.getElementById("scene6Key");
    const pc2TblDiv = document.getElementById("scene6PC2Table");
    const keyNum    = document.getElementById("scene6KeyNum");
    const nextBtn   = document.getElementById("scene6NextBtn");
    const skipBtn   = document.getElementById("scene6SkipBtn");
    const finalBtn  = document.getElementById("scene6ToFinalBtn");
    const wrap      = document.getElementById("scene6Wrap");
  
    // Очистка прошлых элементов
    gridCD.innerHTML    = "";
    pc2TblDiv.innerHTML = "";
    gridKey.innerHTML   = "";
    keyNum.textContent  = `₍${keyGenIndex}₎`;
  
    // Рисуем CD (56 бит)
    cdNow.forEach((bit, i) => {
      const cell = document.createElement("div");
      cell.className   = "bit-cell " + (i < 28 ? "c-bit" : "d-bit");
      cell.textContent = bit;
      gridCD.appendChild(cell);
    });
  
    // Рисуем таблицу PC-2 (48 номеров)
    pc2Table.forEach(n => {
      const d = document.createElement("div");
      d.textContent = n;
      pc2TblDiv.appendChild(d);
    });
  
    // Создаём 48 пустых ячеек для будущего ключа
    for (let i = 0; i < 48; i++) {
      const cell = document.createElement("div");
      cell.className   = "bit-cell bit-gray";
      cell.textContent = "";
      gridKey.appendChild(cell);
    }
  
    // Показ/скрытие кнопок
    if (keyGenIndex <= 16) {
      // до 16-го раунда оба видны, финальная — скрыта
      nextBtn.classList.remove("hidden");
      skipBtn.classList.remove("hidden");
      finalBtn.classList.add("hidden");
    } else {
      // после 16-го никакой анимации, сразу финальный ключ
      nextBtn.classList.add("hidden");
      skipBtn.classList.add("hidden");
      finalBtn.classList.remove("hidden");
      // сохраним все ключи
      localStorage.setItem("desRoundKeys", JSON.stringify(generatedKeys));
      return; // выход — дальше кнопки не навешиваем
    }
  
    // Общая функция завершения текущего раунда (анимированного или пропущенного)
    function finishRound() {
      // 1) Заполняем все 48 ячеек сразу
      const keyBits = pc2Table.map(pos => cdNow[pos - 1]);
      keyBits.forEach((b, idx) => {
        const cell = gridKey.children[idx];
        cell.textContent = b;
        cell.className   = "bit-cell bit-yellow";
      });
      // 2) Сохраняем собранный ключ в массив
      generatedKeys.push(keyBits.join(""));
  
      // 3) Если ещё не был 16-й, делаем циклический сдвиг и перезапускаем сцену
      if (keyGenIndex < 16) {
        const shiftCount = shiftTable[keyGenIndex];
        for (let j = 0; j < shiftCount; j++) {
          cArr.push(cArr.shift());
          dArr.push(dArr.shift());
        }
        keyGenIndex++;
        setupPC2Scene();
      } else {
        nextBtn.classList.add("hidden");
        skipBtn.classList.add("hidden");
        finalBtn.classList.remove("hidden");
        localStorage.setItem("desRoundKeys", JSON.stringify(generatedKeys));
        }
    }
  
    // Кнопка «Пропустить анимацию»
    skipBtn.disabled = false;
    skipBtn.onclick = () => {
      skipBtn.disabled = true;
      nextBtn.disabled = true;
      finishRound();
    };
  
    // Кнопка «Следующий ключ» — запускает по-битную анимацию
    nextBtn.disabled = false;
    nextBtn.onclick = () => {
      nextBtn.disabled = true;
      skipBtn.disabled = true;
      animatePC2Grid(gridCD, gridKey, wrap, finishRound);
    };
  }
  
  
  
  // ===== Анимация PC-2 — «бит за битом» =====
  function animatePC2Grid(gridCD, gridKey, wrap, onComplete) {
    let step = 0;
  
    function stepAnim() {
      if (step >= pc2Table.length) {
        onComplete && onComplete();
        return;
      }
  
      const fromIdx = pc2Table[step] - 1;
      const srcCell = gridCD.children[fromIdx];
      const dstCell = gridKey.children[step];
      const bit     = srcCell.textContent;
  
      // flash-эффект
      srcCell.classList.add("glow");
      setTimeout(() => srcCell.classList.remove("glow"), 600);
  
      // вычисляем координаты
      const wrapR  = wrap.getBoundingClientRect();
      const srcR   = srcCell.getBoundingClientRect();
      const dstR   = dstCell.getBoundingClientRect();
      const startX = srcR.left - wrapR.left;
      const startY = srcR.top  - wrapR.top;
      const endX   = dstR.left - wrapR.left;
      const endY   = dstR.top  - wrapR.top;
  
      // создаём «летящий» клонированный бит
      const flyer = srcCell.cloneNode(true);
      flyer.className        = "moving-bit";
      flyer.style.left       = startX + "px";
      flyer.style.top        = startY + "px";
      flyer.style.transform  = "none";
      flyer.style.transition = `transform ${pc2Config.flightDuration}s ease-in-out`;
      wrap.appendChild(flyer);
  
      // стартуем анимацию
      requestAnimationFrame(() => {
        flyer.style.transform = `translate(${endX - startX}px, ${endY - startY}px)`;
      });
  
      flyer.addEventListener("transitionend", () => {
        flyer.remove();
        // заполняем целевую ячейку
        dstCell.textContent = bit;
        dstCell.className   = "bit-cell bit-yellow";
        step++;
        setTimeout(stepAnim, pc2Config.stepDelay);
      }, { once:true });
    }
  
    stepAnim();
  }  
  // ===== Сцена 7: рендер и анимация всех 16 ключей =====
function setupFinalScene() {
    const grid = document.getElementById("scene7Grid");
    grid.innerHTML = "";
    // generatedKeys — глобальный массив из 16 строк по 48 символов
    generatedKeys.forEach(keyBits => {
      const cell = document.createElement("div");
      cell.className   = "key-cell";
      // для читаемости разобьём каждые 6 бит пробелом:
      const groups = keyBits.match(/.{1,6}/g);      // 8 групп по 6 бит
      const first  = groups.slice(0, 4).join(" ");   // первые 4 группы = 24 бита
      const second = groups.slice(4).join(" ");      // вторые 4 группы = 24 бита
      cell.innerHTML = first + "<br>" + second;
            grid.appendChild(cell);
    });
    animateFinalKeys();
  }
  
  function animateFinalKeys() {
    const cells = document.querySelectorAll("#scene7Grid .key-cell");
    let idx = 0;
    function next() {
      if (idx > 0) cells[idx-1].classList.remove("active");
      if (idx < cells.length) {
        cells[idx].classList.add("active");
        idx++;
        setTimeout(next, 200); // задержка между подсветками, можно подкорректировать
      }
    }
    next();
  }
  // ===== Сцена 8: настройка IP-анимации =====
// глобальная переменная для входного сообщения
let inputMessageBits = [];

// вызывается при переходе на сцену 8
function setupScene8() {
  // Скрываем всё до загрузки сообщения
  document.getElementById("scene8Wrap").style.visibility = "hidden";
  document.getElementById("scene8Split").style.visibility = "hidden";
  document.getElementById("scene8NextBtn").classList.add("hidden");

  // Подключаем загрузчик
  const loadBtn = document.getElementById("scene8LoadBtn");
  loadBtn.disabled = false;
  loadBtn.onclick = () => {
    const raw = document
      .getElementById("scene8InputField")
      .value
      .trim()
      .padEnd(64, "0")
      .slice(0,64);
    // Сохраняем массив '0'/'1'
    inputMessageBits = raw.split("");
    // Рендерим
    renderScene8();
    loadBtn.disabled = true;
  };
}

// ===== Анимация Initial Permutation (используется в scene 8) =====
function animateIP(inputGrid, outputGrid, wrap, onComplete) {
    let step = 0;
  
    function stepAnim() {
      if (step >= IP.length) {
        onComplete && onComplete();
        return;
      }
  
      const fromIdx = IP[step] - 1;
      const srcCell = inputGrid.children[fromIdx];
      const dstCell = outputGrid.children[step];
      const bit     = srcCell.textContent;
  
      // flash
      srcCell.classList.add("glow");
    setTimeout(() => srcCell.classList.remove("glow"), 600);
  
      // координаты в wrap
      const wrapR  = wrap.getBoundingClientRect();
      const srcR   = srcCell.getBoundingClientRect();
      const dstR   = dstCell.getBoundingClientRect();
      const startX = srcR.left - wrapR.left;
      const startY = srcR.top  - wrapR.top;
      const endX   = dstR.left - wrapR.left;
      const endY   = dstR.top  - wrapR.top;
  
      // «летящая» ячейка
      const flyer = srcCell.cloneNode(true);
      flyer.className        = "moving-bit";
      flyer.style.left       = startX + "px";
      flyer.style.top        = startY + "px";
      flyer.style.transform  = "none";
      flyer.style.transition = "transform 0.4s ease-in-out";
      wrap.appendChild(flyer);
  
      // старт анимации
      requestAnimationFrame(() => {
        flyer.style.transform = `translate(${endX - startX}px, ${endY - startY}px)`;
      });
  
      flyer.addEventListener("transitionend", () => {
        flyer.remove();
        dstCell.textContent = bit;
        dstCell.className   = "bit-cell bit-green";
        step++;
        setTimeout(stepAnim, 50);
      }, { once:true });
    }
  
    stepAnim();
  }

function renderScene8() {
  const input    = document.getElementById("scene8Input");
  const ipTable  = document.getElementById("scene8IPTable");
  const output   = document.getElementById("scene8Output");
  const wrap     = document.getElementById("scene8Wrap");
  const split    = document.getElementById("scene8Split");
  const nextBtn  = document.getElementById("scene8NextBtn");

  // 1) Исходный 8×8 из inputMessageBits
  input.innerHTML = "";
  inputMessageBits.forEach(b => {
    const cell = document.createElement("div");
    cell.className   = "bit-cell bit-gray";
    cell.textContent = b;
    input.appendChild(cell);
  });

  // 2) IP-таблица (она у вас уже есть как IP[])
  ipTable.innerHTML = "";
  IP.forEach(n => {
    const d = document.createElement("div");
    d.textContent = n;
    ipTable.appendChild(d);
  });

  // 3) Подготовка пустого output
  output.innerHTML = "";
  for (let i = 0; i < 64; i++) {
    const c = document.createElement("div");
    c.className   = "bit-cell bit-gray";
    c.textContent = "";
    output.appendChild(c);
  }

  // Показываем wrap и запускаем анимацию
  wrap.style.visibility = "visible";
  animateIP(input, output, wrap, () => {
    // После IP — делим на L₀/R₀
    const L0 = document.getElementById("scene8L0");
    const R0 = document.getElementById("scene8R0");
    L0.innerHTML = "";
    R0.innerHTML = "";

    

    // собираем результат IP
    const permuted = Array.from(output.children).map(c => c.textContent);

    permuted.slice(0,32).forEach(b => {
      const c = document.createElement("div");
      c.className   = "bit-cell c-bit";
      c.textContent = b;
      L0.appendChild(c);
    });
    permuted.slice(32).forEach(b => {
      const c = document.createElement("div");
      c.className   = "bit-cell d-bit";
      c.textContent = b;
      R0.appendChild(c);
    });
    split.style.visibility = "visible";

    // Показываем кнопку «Далее»
        nextBtn.classList.remove("hidden");
        nextBtn.disabled = false;  
        nextBtn.onclick = onNext;  
  });
}


// ===== Сцена 9: Раундовая структура =====
let roundIndex = 1;    // текущий раунд (1…16)
let stepIndex  = 0;    // шаг внутри раунда (0…5)
let lArr = [], rArr = []; // Lᵢ₋₁ и Rᵢ₋₁
let isPaused = false;

// scheduleNext остаётся для анимации «летящих» битов
function scheduleNext(fn, delay) {
  setTimeout(() => {
    if (!isPaused) fn();
    else scheduleNext(fn, 200);
  }, delay);
}

// Подсветка панели шагов
function setStepBar(n) {
  document.querySelectorAll(".steps-bar .step")
    .forEach(el => el.classList.toggle("active", +el.dataset.step === n));
}

// Подсветка формулы
function highlightFormula(part) {
  document.querySelectorAll(".formula span")
    .forEach(el => el.classList.toggle("highlight", el.classList.contains(part)));
}

// «Летающий» бит
function flyBit(srcCell, dstCell, onDone) {
  const wrap = document.getElementById("scene9Wrap");
  const wrapR = wrap.getBoundingClientRect();
  const sR = srcCell.getBoundingClientRect();
  const dR = dstCell.getBoundingClientRect();
  const flyer = srcCell.cloneNode(true);
  flyer.className = "moving-bit";
  flyer.style.left = (sR.left - wrapR.left) + "px";
  flyer.style.top  = (sR.top  - wrapR.top ) + "px";
  wrap.appendChild(flyer);
  requestAnimationFrame(() => {
    flyer.style.transform =
      `translate(${dR.left - sR.left}px, ${dR.top - sR.top}px)`;
  });
  flyer.addEventListener("transitionend", () => {
    flyer.remove();
    onDone && onDone();
  }, { once: true });
}

// Пропустить всю анимацию и сразу нарисовать финальные результаты
function skipAllSteps() {
  // 1) Expand → 48 бит
  const Ebox = document.getElementById("scene9E");
  Ebox.innerHTML = "";
  const Earr = IP_EXPAND.map(pos => rArr[pos - 1]);
  Earr.forEach(bit => {
    const c = document.createElement("div");
    c.className   = "bit-cell bit-green";
    c.textContent = bit;
    Ebox.appendChild(c);
  });

  // 2) XOR₄₈
  const X48 = document.getElementById("scene9XOR");
  X48.innerHTML = "";
  const keyBits = generatedKeys[roundIndex - 1]
                    .split("")
                    .map(b => +b);
  const X48arr = Earr.map((b,i)=> b ^ keyBits[i]);
  X48arr.forEach((res,i) => {
    const c = document.createElement("div");
    c.className   = "bit-cell bit-yellow";
    c.textContent = `${Earr[i]}⊕${keyBits[i]}=${res}`;
    X48.appendChild(c);
  });

  // 3) S-блоки → 32 бита
  const sContainer = document.getElementById("scene9SBoxes");
  sContainer.innerHTML = "";
  let Sout = [];
  for (let s = 0; s < 8; s++) {
    const chunk = X48arr.slice(s*6, s*6+6);
    const row = (chunk[0]<<1)|chunk[5];
    const col = chunk.slice(1,5).reduce((r,v)=>(r<<1)|v,0);
    const val = SBoxes[s][row][col];
    const bits = val.toString(2).padStart(4,"0").split("").map(x=>+x);
    Sout = Sout.concat(bits);

    const box = document.createElement("div");
    box.className = "sbox";
    box.innerHTML = `<div class="title">S${s+1}</div>`;
    const grid = document.createElement("div");
    grid.className = "bit-grid scene9-32";
    grid.style.gridTemplateColumns = "repeat(4, var(--bit-size))";
    bits.forEach(b => {
      const cc = document.createElement("div");
      cc.className   = "bit-cell bit-green";
      cc.textContent = b;
      grid.appendChild(cc);
    });
    box.appendChild(grid);
    sContainer.appendChild(box);
  }

  // 4) P-перестановка → 32 бита
  const Pbox = document.getElementById("scene9P");
  Pbox.innerHTML = "";
  const Parr = P.map(pos => Sout[pos-1]);
  Parr.forEach(b => {
    const cc = document.createElement("div");
    cc.className   = "bit-cell bit-green";
    cc.textContent = b;
    Pbox.appendChild(cc);
  });

  // 5) XOR₂ с Lᵢ₋₁ → новый Rᵢ
  const X2box = document.getElementById("scene9XOR2");
  X2box.innerHTML = "";
  const oldL = lArr.map(x=>+x);
  const newR = Parr.map((b,i) => {
    const x = oldL[i] ^ b;
    const cc = document.createElement("div");
    cc.className   = "bit-cell bit-yellow";
    cc.textContent = `${oldL[i]}⊕${b}=${x}`;
    X2box.appendChild(cc);
    return x.toString();
  });

  // 6) Swap → показать новый L и R
  const Lbox = document.getElementById("scene9L");
  const Rbox = document.getElementById("scene9R");
  Lbox.innerHTML = "";
  Rbox.innerHTML = "";
  // новый Lᵢ = старый Rᵢ₋₁
  rArr.forEach(bit => {
    const cc = document.createElement("div");
    cc.className   = "bit-cell c-bit";
    cc.textContent = bit;
    Lbox.appendChild(cc);
  });
  // новый Rᵢ = результат XOR₂
  newR.forEach(bit => {
    const cc = document.createElement("div");
    cc.className   = "bit-cell d-bit";
    cc.textContent = bit;
    Rbox.appendChild(cc);
  });

  // Обновить lArr и rArr
  lArr = [...rArr];
  rArr = [...newR];

  // Финализируем панель шагов и управление кнопками
  setStepBar(6);
  document.getElementById("scene9NextBtn").classList.add("hidden");
  document.getElementById("scene9SkipBtn").classList.add("hidden");

  if (roundIndex < 16) {
    const nr = document.getElementById("scene9NextRoundBtn");
    nr.textContent = `Раунд ${roundIndex+1}`;
    nr.classList.remove("hidden");
    nr.onclick = () => {
      roundIndex++;
      setupScene9();
    };
  } else {
    document.getElementById("scene9ToFinalBtn")
            .classList.remove("hidden");
  }
}

// Инициализация сцены 9
function setupScene9() {
  // 1) Получить L₀/R₀ из Сцены 8
  lArr = Array.from(document.getElementById("scene8L0").children)
               .map(c => c.textContent);
  rArr = Array.from(document.getElementById("scene8R0").children)
               .map(c => c.textContent);

  // 2) Рендерим текущий раундовый ключ
  const keyBits = generatedKeys[roundIndex - 1].split("");
  const keyGrid = document.getElementById("scene9KeyBits");
  keyGrid.innerHTML = "";
  keyBits.forEach(bit => {
    const c = document.createElement("div");
    c.className   = "bit-cell bit-yellow";
    c.textContent = bit;
    keyGrid.appendChild(c);
  });

  // 3) Сбросить состояние
  stepIndex = 0;
  document.getElementById("roundNum").textContent   = roundIndex;
  document.getElementById("roundIndex").textContent = roundIndex;
  setStepBar(1);
  highlightFormula(null);

  // 4) Очистить все блоки
  ["scene9R","scene9E","scene9XOR","scene9SBoxes","scene9P","scene9XOR2","scene9L"]
    .forEach(id => document.getElementById(id).innerHTML = "");

  // 5) Нарисовать Rᵢ₋₁
  const Rbox = document.getElementById("scene9R");
  rArr.forEach(bit => {
    const c = document.createElement("div");
    c.className   = "bit-cell d-bit";
    c.textContent = bit;
    Rbox.appendChild(c);
  });

  // 6) Подключить Pause/Resume
  const pauseBtn  = document.getElementById("pauseBtn");
  const resumeBtn = document.getElementById("resumeBtn");
  pauseBtn.onclick  = () => {
    isPaused = true;
    pauseBtn.classList.add("hidden");
    resumeBtn.classList.remove("hidden");
  };
  resumeBtn.onclick = () => {
    isPaused = false;
    resumeBtn.classList.add("hidden");
    pauseBtn.classList.remove("hidden");
  };

  // 7) Подключить все кнопки
  const stepBtn    = document.getElementById("scene9NextBtn");
  const skipBtn    = document.getElementById("scene9SkipBtn");
  const nextRndBtn = document.getElementById("scene9NextRoundBtn");
  const toFinalBtn = document.getElementById("scene9ToFinalBtn");

  stepBtn.textContent = "Шаг 1: Expand";
  stepBtn.classList.remove("hidden");
  stepBtn.disabled    = false;
  skipBtn.classList.remove("hidden");
  skipBtn.disabled    = false;
  nextRndBtn.classList.add("hidden");
  toFinalBtn.classList.add("hidden");

  stepBtn.onclick    = nextSubStep;
  skipBtn.onclick    = skipAllSteps;
}

// Обработчик клика по «Следующий шаг»
function nextSubStep() {
  const stepBtn    = document.getElementById("scene9NextBtn");
  const skipBtn    = document.getElementById("scene9SkipBtn");
  const nextRndBtn = document.getElementById("scene9NextRoundBtn");
  const toFinalBtn = document.getElementById("scene9ToFinalBtn");
  const labels     = ["Expand","XOR₄₈","S-блоки","P-perm","XOR₂","Swap"];

  switch (stepIndex) {
    case 0: doExpand();  break;
    case 1: doXor48();   break;
    case 2: doSBoxes();  break;
    case 3: doPPerm();   break;
    case 4: doXor32();   break;
    case 5: doSwap();    break;
  }
  stepIndex++;

  if (stepIndex < 6) {
    setStepBar(stepIndex+1);
    stepBtn.textContent = `Шаг ${stepIndex+1}: ${labels[stepIndex]}`;
  } else {
    // конец раунда
    stepBtn.classList.add("hidden");
    skipBtn.classList.add("hidden");
    if (roundIndex < 16) {
      nextRndBtn.textContent = `Раунд ${roundIndex+1}`;
      nextRndBtn.classList.remove("hidden");
      nextRndBtn.onclick = () => {
        roundIndex++;
        setupScene9();
      };
    } else {
      toFinalBtn.classList.remove("hidden");
    }
  }
}

// ==== Шаги 1–6 (анимационные реализации) ====
// Здесь используем точно те же функции doExpand, doXor48, doSBoxes, doPPerm, doXor32, doSwap,
// которые у Вас уже были — их менять не нужно.



// 1) Expand R → 48 бит
function doExpand() {
  highlightFormula('expand');
  const Ebox = document.getElementById("scene9E");
  Ebox.innerHTML = "";
  IP_EXPAND.forEach(() => {
    const c = document.createElement("div");
    c.className = "bit-cell bit-gray";
    Ebox.appendChild(c);
  });
  IP_EXPAND.forEach((rPos, i) => {
    const src = document.getElementById("scene9R").children[rPos-1];
    const dst = Ebox.children[i];
    const bit = rArr[rPos-1];
    scheduleNext(() => {
      src.classList.add('glow');
      setTimeout(()=>src.classList.remove('glow'),600);
      flyBit(src, dst, () => {
        dst.textContent = bit;
        dst.classList.replace("bit-gray","bit-green");
      });
    }, i*60);
  });
}

// 2) XOR₄₈
function doXor48() {
  highlightFormula('xor1');
  const keyBits = generatedKeys[roundIndex-1].split("");
  const Ebox    = document.getElementById("scene9E");
  const X48     = document.getElementById("scene9XOR");
  X48.innerHTML = "";
  keyBits.forEach((kb,i) => {
    const dst = document.createElement("div");
    dst.className = "bit-cell bit-yellow";
    X48.appendChild(dst);
    scheduleNext(() => {
      const src = Ebox.children[i];
      src.classList.add('glow');
      setTimeout(()=>src.classList.remove('glow'),600);
      flyBit(src, dst, () => {
        const a = +src.textContent;
        const c = a ^ +kb;
        dst.textContent = `${a}⊕${kb}=${c}`;
      });
    }, i*80);
  });
}

// 3) S-блоки → 32 бит
function doSBoxes() {
  highlightFormula('sboxes');
  const xorCells  = Array.from(document.getElementById("scene9XOR").children);
  const container = document.getElementById("scene9SBoxes");
  container.innerHTML = "";
  let delay = 0;
  for (let s=0; s<8; s++) {
    const box  = document.createElement("div");
    box.className = "sbox";
    box.innerHTML = `<div class="title">S${s+1}</div>`;
    const grid = document.createElement("div");
    grid.className = "bit-grid scene9-32";
    grid.style.gridTemplateColumns = "repeat(4, var(--bit-size))";
    box.appendChild(grid);
    container.appendChild(box);
    scheduleNext(() => {
      const chunk = xorCells.slice(s*6,s*6+6).map(c=>+c.textContent);
      const row   = (chunk[0]<<1)|chunk[5];
      const col   = chunk.slice(1,5).reduce((r,v)=>(r<<1)|v,0);
      const val   = SBoxes[s][row][col];
      const bits  = val.toString(2).padStart(4,"0").split("");
      bits.forEach((b,j) => {
        const dst = document.createElement("div");
        dst.className = "bit-cell bit-green";
        grid.appendChild(dst);
        flyBit(xorCells[s*6+j], dst, ()=>dst.textContent=b);
      });
    }, delay);
    delay += 500;
  }
}

// 4) P-перестановка → 32 бит
function doPPerm() {
  highlightFormula('pperm');
  const outCells = Array.from(
    document.querySelectorAll("#scene9SBoxes .bit-cell.bit-green")
  );
  const Pbox = document.getElementById("scene9P");
  Pbox.innerHTML = "";
  P.forEach((pos,i) => {
    const dst = document.createElement("div");
    dst.className = "bit-cell bit-green";
    Pbox.appendChild(dst);
    scheduleNext(() => {
      flyBit(outCells[pos-1], dst, () => {
        dst.textContent = outCells[pos-1].textContent;
      });
    }, i*60);
  });
}

// 5) XOR₂ с Lᵢ₋₁
function doXor32() {
  highlightFormula('xor2');
  const L0   = [...lArr];
  const Pbox = document.getElementById("scene9P");
  const X2   = document.getElementById("scene9XOR2");
  X2.innerHTML = "";
  Array.from(Pbox.children).forEach((src,i) => {
    const dst = document.createElement("div");
    dst.className = "bit-cell bit-yellow";
    X2.appendChild(dst);
    scheduleNext(() => {
      src.classList.add('glow');
      setTimeout(()=>src.classList.remove('glow'),600);
      flyBit(src, dst, () => {
        const a = +L0[i], b = +src.textContent;
        dst.textContent = `${a}⊕${b}=${a^b}`;
      });
    }, i*60);
  });
}

// 6) Swap → подготовка к следующему раунду
function doSwap() {
  highlightFormula('swap');
  const prevR = Array.from(document.getElementById("scene9R").children);
  const x2    = Array.from(document.getElementById("scene9XOR2").children);
  const newR  = x2.map(c => c.textContent.split("=").pop());
  lArr = [...rArr];
  rArr = newR;
  const Lbox = document.getElementById("scene9L");
  const Rbox = document.getElementById("scene9R");
  Lbox.innerHTML = "";
  Rbox.innerHTML = "";

  prevR.forEach((src,i) => {
    const dst = document.createElement("div");
    dst.className = "bit-cell c-bit";
    Lbox.appendChild(dst);
    scheduleNext(() => {
      src.classList.add('glow');
      setTimeout(()=>src.classList.remove('glow'),600);
      flyBit(src, dst, () => dst.textContent = src.textContent);
    }, i*40);
  });

  x2.forEach((src,i) => {
    const dst = document.createElement("div");
    dst.className = "bit-cell d-bit";
    Rbox.appendChild(dst);
    scheduleNext(() => {
      src.classList.add('glow');
      setTimeout(()=>src.classList.remove('glow'),600);
      flyBit(src, dst, () => {
        dst.textContent = src.textContent.split("=").pop();
      });
    }, 500 + i*40);
  });
}

// При загрузке сцены 9
document.getElementById("scene-9").addEventListener("scene:show", setupScene9);

// В конец main.js, после renderScene8 и setupScene9:

// ===== Анимация финальной перестановки IP⁻¹ (Scene 10) =====
function animateIPInv(inputGrid, outputGrid, wrap, onComplete) {
    let step = 0;
    function stepAnim() {
      if (step >= IP_INV.length) {
        onComplete && onComplete();
        return;
      }
      const fromIdx = IP_INV[step] - 1;
      const srcCell = inputGrid.children[fromIdx];
      const dstCell = outputGrid.children[step];
      const bit     = srcCell.textContent;
  
      // подсветка
      srcCell.classList.add("glow");
      setTimeout(() => srcCell.classList.remove("glow"), 600);
  
      // координаты
      const wrapR = wrap.getBoundingClientRect();
      const sR    = srcCell.getBoundingClientRect();
      const dR    = dstCell.getBoundingClientRect();
      const startX = sR.left - wrapR.left;
      const startY = sR.top  - wrapR.top;
      const endX   = dR.left - wrapR.left;
      const endY   = dR.top  - wrapR.top;
  
      // «летящий» бит
      const flyer = srcCell.cloneNode(true);
      flyer.className = "moving-bit";
      flyer.style.left = startX + "px";
      flyer.style.top  = startY + "px";
      wrap.appendChild(flyer);
  
      requestAnimationFrame(() => {
        flyer.style.transform = `translate(${endX - startX}px, ${endY - startY}px)`;
      });
      flyer.addEventListener("transitionend", () => {
        flyer.remove();
        dstCell.textContent = bit;
        dstCell.classList.replace("bit-gray", "bit-green");
        step++;
        setTimeout(stepAnim, 50);
      }, { once: true });
    }
    stepAnim();
  }
  
  // ===== Сцена 10: Финал шифрования =====
  function setupScene10() {
    const concat  = document.getElementById("scene10Concat");
    const ipTbl   = document.getElementById("scene10IPTable");
    const output  = document.getElementById("scene10Output");
    const wrap    = document.getElementById("scene10Wrap");
    const doneMsg = document.getElementById("scene10Complete");
    const nextBtn = document.getElementById("scene10NextBtn");
  
    // Очистить
    concat.innerHTML = "";
    ipTbl.innerHTML  = "";
    output.innerHTML = "";
    doneMsg.classList.add("hidden");
    nextBtn.classList.add("hidden");
  
    // 1) Объединяем R₁₆ и L₁₆
    // rArr — R₁₆, lArr — L₁₆ (после 16 раунда)
    const combined = rArr.concat(lArr);
    combined.forEach(b => {
      const c = document.createElement("div");
      c.className = "bit-cell bit-gray";
      c.textContent = b;
      concat.appendChild(c);
    });
  
    // 2) IP_INV таблица
    IP_INV.forEach(n => {
      const d = document.createElement("div");
      d.textContent = n;
      ipTbl.appendChild(d);
    });
  
    // 3) Пустой выход
    for (let i = 0; i < 64; i++) {
      const c = document.createElement("div");
      c.className = "bit-cell bit-gray";
      output.appendChild(c);
    }
  
    // 4) Запустить анимацию
    animateIPInv(concat, output, wrap, () => {
      doneMsg.classList.remove("hidden");
      nextBtn.classList.remove("hidden");
    });
  }

  
  // Уже в onNext есть: case "scene-10": setupScene10(); break;

 // После того как вы сгенерировали массив generatedKeys (16 раундовых ключей):

// ===== Сцена 12 — Раундовая структура (расшифровка) =====
let roundIndex12 = 1;
let stepIndex12  = 0;
let lArr12 = [], rArr12 = [];
let isPaused12 = false;
const reversedKeys = generatedKeys.slice().reverse();

// scheduleNext12
function scheduleNext12(fn, delay) {
  setTimeout(() => {
    if (!isPaused12) fn();
    else scheduleNext12(fn, 200);
  }, delay);
}

// setStepBar12
function setStepBar12(n) {
  document.querySelectorAll("#scene-12 .steps-bar .step")
    .forEach(el => el.classList.toggle("active", +el.dataset.step === n));
}

// highlightFormula12
function highlightFormula12(part) {
  document.querySelectorAll("#scene-12 .formula span")
    .forEach(el => el.classList.toggle("highlight", part && el.classList.contains(part)));
}

// skipAllSteps12
function skipAllSteps12() {
  const Ebox   = document.getElementById("scene12E");
  const X48box = document.getElementById("scene12XOR");
  const SboxC  = document.getElementById("scene12SBoxes");
  const Pbox   = document.getElementById("scene12P");
  const X2box  = document.getElementById("scene12XOR2");
  const Lbox   = document.getElementById("scene12L");
  const Rbox   = document.getElementById("scene12R");

  Ebox.innerHTML    = "";
  X48box.innerHTML  = "";
  SboxC.innerHTML   = "";
  Pbox.innerHTML    = "";
  X2box.innerHTML   = "";
  Lbox.innerHTML    = "";
  Rbox.innerHTML    = "";

  // 1) Expand
  const Earr = IP_EXPAND.map(pos => rArr12[pos-1]);
  Earr.forEach(b => {
    const c = document.createElement("div");
    c.className   = "bit-cell bit-green";
    c.textContent = b;
    Ebox.appendChild(c);
  });

  // 2) XOR₄₈
  const key48 = reversedKeys[roundIndex12-1].split("").map(x=>+x);
  const X48 = Earr.map((b,i) => b ^ key48[i]);
  X48.forEach((res,i) => {
    const c = document.createElement("div");
    c.className   = "bit-cell bit-yellow";
    c.textContent = `${Earr[i]}⊕${key48[i]}=${res}`;
    X48box.appendChild(c);
  });

  // 3) S-блоки
  let Sout = [];
  for (let s=0; s<8; s++) {
    const chunk = X48.slice(s*6, s*6+6);
    const row   = (chunk[0]<<1)|chunk[5];
    const col   = chunk.slice(1,5).reduce((r,v)=>(r<<1)|v,0);
    const val   = SBoxes[s][row][col];
    const bits  = val.toString(2).padStart(4,"0").split("").map(x=>+x);
    Sout = Sout.concat(bits);
    const box = document.createElement("div"); box.className="sbox";
    box.innerHTML = `<div class="title">S${s+1}</div>`;
    const grid = document.createElement("div"); grid.className="bit-grid scene9-32";
    bits.forEach(b => {
      const cc = document.createElement("div");
      cc.className="bit-cell bit-green";
      cc.textContent=b;
      grid.appendChild(cc);
    });
    box.appendChild(grid);
    SboxC.appendChild(box);
  }

  // 4) P-perm
  const Parr = P.map(pos => Sout[pos-1]);
  Parr.forEach(b => {
    const cc = document.createElement("div");
    cc.className="bit-cell bit-green";
    cc.textContent=b;
    Pbox.appendChild(cc);
  });

  // 5) XOR₂
  const oldL = lArr12.map(x=>+x);
  const newR = Parr.map((b,i) => {
    const x = oldL[i]^b;
    const cc = document.createElement("div");
    cc.className="bit-cell bit-yellow";
    cc.textContent=`${oldL[i]}⊕${b}=${x}`;
    X2box.appendChild(cc);
    return x.toString();
  });

  // 6) Swap → новый L/R
  Rbox.innerHTML = ""; Lbox.innerHTML = "";
  rArr12.forEach(bit => {
    const c = document.createElement("div");
    c.className="bit-cell c-bit";
    c.textContent=bit;
    Lbox.appendChild(c);
  });
  newR.forEach(bit => {
    const c = document.createElement("div");
    c.className="bit-cell d-bit";
    c.textContent=bit;
    Rbox.appendChild(c);
  });

  lArr12 = [...rArr12];
  rArr12 = [...newR];

  setStepBar12(6);
  document.getElementById("scene12NextBtn").classList.add("hidden");
  document.getElementById("scene12SkipBtn").classList.add("hidden");

  if (roundIndex12<16) {
    const nr = document.getElementById("scene12NextRoundBtn");
    nr.textContent=`Раунд ${roundIndex12+1}`;
    nr.classList.remove("hidden");
    nr.onclick = ()=>{ roundIndex12++; setupScene12(); };
  } else {
    document.getElementById("scene12ToFinalBtn").classList.remove("hidden");
  }
}

// setupScene12
function setupScene12() {
  lArr12 = Array.from(document.getElementById("scene-11").querySelectorAll(".final-L .bit-cell"))
                 .map(c=>c.textContent);
  rArr12 = Array.from(document.getElementById("scene-11").querySelectorAll(".final-R .bit-cell"))
                 .map(c=>c.textContent);

  const keyBits = reversedKeys[roundIndex12-1].split("");
  const keyGrid = document.getElementById("scene12KeyBits");
  keyGrid.innerHTML="";
  keyBits.forEach(bit=>{
    const c=document.createElement("div");
    c.className="bit-cell bit-yellow";
    c.textContent=bit;
    keyGrid.appendChild(c);
  });

  stepIndex12=0;
  document.getElementById("roundNum12").textContent   = roundIndex12;
  document.getElementById("roundIndex12").textContent = roundIndex12;
  setStepBar12(1);
  highlightFormula12(null);

  ["scene12R","scene12E","scene12XOR","scene12SBoxes","scene12P","scene12XOR2","scene12L"]
    .forEach(id=>document.getElementById(id).innerHTML="");

  const Rbox = document.getElementById("scene12R");
  rArr12.forEach(bit=>{
    const c=document.createElement("div");
    c.className="bit-cell d-bit";
    c.textContent=bit;
    Rbox.appendChild(c);
  });

  document.getElementById("pauseBtn12").onclick = ()=>{
    isPaused12=true;
    document.getElementById("pauseBtn12").classList.add("hidden");
    document.getElementById("resumeBtn12").classList.remove("hidden");
  };
  document.getElementById("resumeBtn12").onclick = ()=>{
    isPaused12=false;
    document.getElementById("resumeBtn12").classList.add("hidden");
    document.getElementById("pauseBtn12").classList.remove("hidden");
  };

  const stepBtn    = document.getElementById("scene12NextBtn");
  const skipBtn    = document.getElementById("scene12SkipBtn");
  const nextRndBtn = document.getElementById("scene12NextRoundBtn");
  const toFinalBtn = document.getElementById("scene12ToFinalBtn");

  stepBtn.textContent = "Шаг 1: Expand";
  stepBtn.classList.remove("hidden"); stepBtn.disabled=false;
  skipBtn.classList.remove("hidden"); skipBtn.disabled=false;
  nextRndBtn.classList.add("hidden");
  toFinalBtn.classList.add("hidden");

  stepBtn.onclick = nextSubStep12;
  skipBtn.onclick = skipAllSteps12;
}

// nextSubStep12
function nextSubStep12() {
  const labels = ["Expand","XOR₄₈","S-блоки","P-perm","XOR₂","Swap"];
  switch(stepIndex12) {
    case 0: doExpand12();  break;
    case 1: doXor48_12();  break;
    case 2: doSBoxes12();  break;
    case 3: doPPerm12();   break;
    case 4: doXor32_12();  break;
    case 5: doSwap12();    break;
  }
  stepIndex12++;
  if (stepIndex12<6) {
    setStepBar12(stepIndex12+1);
    document.getElementById("scene12NextBtn").textContent = `Шаг ${stepIndex12+1}: ${labels[stepIndex12]}`;
  }
}

// 1) doExpand12
function doExpand12() {
  highlightFormula12('expand');
  const Ebox = document.getElementById("scene12E");
  Ebox.innerHTML="";
  IP_EXPAND.forEach(()=> {
    const c=document.createElement("div"); c.className="bit-cell bit-gray"; Ebox.appendChild(c);
  });
  IP_EXPAND.forEach((pos,i)=>{
    const src = document.getElementById("scene12R").children[pos-1];
    const dst = Ebox.children[i];
    const bit= rArr12[pos-1];
    scheduleNext12(()=>{
      src.classList.add("glow");
      setTimeout(()=>src.classList.remove("glow"),600);
      flyBit(src,dst,()=>{
        dst.textContent=bit;
        dst.classList.replace("bit-gray","bit-green");
      });
    }, i*60);
  });
}

// 2) doXor48_12
function doXor48_12() {
  highlightFormula12('xor1');
  const key48 = reversedKeys[roundIndex12-1].split("");
  const Ebox  = document.getElementById("scene12E");
  const X48   = document.getElementById("scene12XOR");
  X48.innerHTML="";
  key48.forEach((kb,i)=>{
    const dst=document.createElement("div"); dst.className="bit-cell bit-yellow"; X48.appendChild(dst);
    scheduleNext12(()=>{
      const src=Ebox.children[i];
      src.classList.add("glow");
      setTimeout(()=>src.classList.remove("glow"),600);
      flyBit(src,dst,()=>{
        const a=+src.textContent, c=a^+kb;
        dst.textContent=`${a}⊕${kb}=${c}`;
      });
    }, i*80);
  });
}

// 3) doSBoxes12
function doSBoxes12() {
  highlightFormula12('sboxes');
  const xorCells=Array.from(document.getElementById("scene12XOR").children);
  const container=document.getElementById("scene12SBoxes");
  container.innerHTML="";
  let delay=0;
  for(let s=0;s<8;s++){
    const box=document.createElement("div"); box.className="sbox";
    box.innerHTML=`<div class="title">S${s+1}</div>`;
    const grid=document.createElement("div"); grid.className="bit-grid scene9-32";
    box.appendChild(grid); container.appendChild(box);
    scheduleNext12(()=>{
      const chunk=xorCells.slice(s*6,s*6+6).map(c=>+c.textContent);
      const row=(chunk[0]<<1)|chunk[5];
      const col=chunk.slice(1,5).reduce((r,v)=>(r<<1)|v,0);
      const val=SBoxes[s][row][col];
      const bits=val.toString(2).padStart(4,"0").split("");
      bits.forEach((b,j)=>{
        const dst=document.createElement("div"); dst.className="bit-cell bit-green"; grid.appendChild(dst);
        flyBit(xorCells[s*6+j],dst,()=>dst.textContent=b);
      });
    }, delay);
    delay+=500;
  }
}

// 4) doPPerm12
function doPPerm12() {
  highlightFormula12('pperm');
  const outCells=Array.from(document.querySelectorAll("#scene12SBoxes .bit-cell.bit-green"));
  const Pbox=document.getElementById("scene12P");
  Pbox.innerHTML="";
  P.forEach((pos,i)=>{
    const dst=document.createElement("div"); dst.className="bit-cell bit-green"; Pbox.appendChild(dst);
    scheduleNext12(()=>{
      flyBit(outCells[pos-1],dst,()=>dst.textContent=outCells[pos-1].textContent);
    }, i*60);
  });
}

// 5) doXor32_12
function doXor32_12() {
  highlightFormula12('xor2');
  const oldL=[...lArr12];
  const Pbox=document.getElementById("scene12P");
  const X2=document.getElementById("scene12XOR2");
  X2.innerHTML="";
  Array.from(Pbox.children).forEach((src,i)=>{
    const dst=document.createElement("div"); dst.className="bit-cell bit-yellow"; X2.appendChild(dst);
    scheduleNext12(()=>{
      src.classList.add("glow");
      setTimeout(()=>src.classList.remove("glow"),600);
      flyBit(src,dst,()=>{
        const a=+oldL[i], b=+src.textContent;
        dst.textContent=`${a}⊕${b}=${a^b}`;
      });
    }, i*60);
  });
}

// 6) doSwap12
function doSwap12() {
  highlightFormula12('swap');
  const prevR=Array.from(document.getElementById("scene12R").children);
  const x2=Array.from(document.getElementById("scene12XOR2").children);
  const Lbox=document.getElementById("scene12L");
  const Rbox=document.getElementById("scene12R");
  Lbox.innerHTML=""; Rbox.innerHTML="";
  prevR.forEach((src,i)=>{
    const dst=document.createElement("div"); dst.className="bit-cell c-bit"; Lbox.appendChild(dst);
    scheduleNext12(()=>{
      src.classList.add("glow");
      setTimeout(()=>src.classList.remove("glow"),600);
      flyBit(src,dst,()=>dst.textContent=src.textContent);
    }, i*40);
  });
  x2.forEach((src,i)=>{
    const dst=document.createElement("div"); dst.className="bit-cell d-bit"; Rbox.appendChild(dst);
    scheduleNext12(()=>{
      src.classList.add("glow");
      setTimeout(()=>src.classList.remove("glow"),600);
      flyBit(src,dst,()=>dst.textContent=src.textContent.split("=").pop());
    }, 500 + i*40);
  });
  lArr12=[...rArr12];
  rArr12=x2.map(c=>c.textContent.split("=").pop());
}

// event listener
document.getElementById("scene-12").addEventListener("scene:show", setupScene12);

// ===== Сцена 13 — Финальная перестановка (IP⁻¹) и вывод plaintext =====
document.getElementById("scene-13").addEventListener("scene:show", () => {
  // 1) Отрисовать входную последовательность R₀ || L₀
  const rl = document.getElementById("scene13RL");
  rl.innerHTML = "";
  rArr.concat(lArr).forEach(bit => {
    const c = document.createElement("div");
    c.className   = "bit-cell";
    c.textContent = bit;
    rl.appendChild(c);
  });

  // 2) Отрисовать номера IP_INV
  const numTable = document.getElementById("scene13IPinvNums");
  numTable.innerHTML = "";
  IP_INV.forEach(n => {
    const c = document.createElement("div");
    c.className   = "bit-cell";
    c.textContent = n;
    numTable.appendChild(c);
  });

  // 3) Подготовить ячейки для вывода
  const outTable = document.getElementById("scene13IPinv");
  outTable.innerHTML = "";
  IP_INV.forEach(() => {
    const c = document.createElement("div");
    c.className = "bit-cell bit-gray";
    outTable.appendChild(c);
  });

  // 4) Очистить плейнтекст
  const plain = document.getElementById("scene13Plain");
  plain.innerHTML = "";

  // 5) Обработчик «Шаг IP⁻¹»
  document.getElementById("scene13StepBtn").onclick = () => {
    animateIPInv(
      numTable, 
      outTable, 
      document.getElementById("scene13Wrap"),
      () => {
        // Собираем двоичный результат и конвертим в ASCII
        const bits = Array.from(outTable.children).map(c => c.textContent);
        const chars = [];
        for (let i = 0; i < bits.length; i += 8) {
          const byte = bits.slice(i, i + 8).join("");
          chars.push(String.fromCharCode(parseInt(byte, 2)));
        }
        plain.textContent = chars.join("");
        document.getElementById("scene13DoneBtn").classList.remove("hidden");
      }
    );
  };

  // 6) Обработчик «Пропустить»
  document.getElementById("scene13SkipBtn").onclick = () => {
    const combined = rArr.concat(lArr);
    const bits = IP_INV.map(idx => combined[idx - 1]);
    const chars = [];
    for (let i = 0; i < bits.length; i += 8) {
      const byte = bits.slice(i, i + 8).join("");
      chars.push(String.fromCharCode(parseInt(byte, 2)));
    }
    plain.textContent = chars.join("");
    document.getElementById("scene13DoneBtn").classList.remove("hidden");
  };
});
