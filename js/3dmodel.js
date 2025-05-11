document.addEventListener('DOMContentLoaded', () => {
    let scene, camera, renderer, model;

    // Обновление размеров контейнера
    function updateModelContainerSize() {
        const container = document.getElementById('model-container');
        const w = window.innerWidth;
        let size;

        if (w <= 768) {
            size = w - 40;
        } else if (w <= 1600) {
            size = w / 2 - 40;
        } else {
            size = w / 3 - 40;
        }

        // Устанавливаем одинаковую ширину и высоту
        container.style.width = `${size}px`;
        container.style.height = `${size}px`;
        
        // Обновление рендерера и камеры
        if (renderer) {
            renderer.setSize(container.clientWidth, container.clientHeight);
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
        }
    }

    // Запуск обновления при загрузке страницы
    window.addEventListener('DOMContentLoaded', updateModelContainerSize);

    // Запуск при изменении размера окна
    window.addEventListener('resize', updateModelContainerSize);

    function init() {
        // 1. Инициализация сцены
        scene = new THREE.Scene();
        const envLoader = new THREE.RGBELoader();
        envLoader.load('../models/whall.hdr', (texture) => {
            texture.mapping = THREE.EquirectangularReflectionMapping;
            scene.environment = texture;
        });

        camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        const container = document.getElementById('model-container');
        container.appendChild(renderer.domElement);  // Вставка рендерера в контейнер

        // Вспомогательный окружающий свет
        const ambient = new THREE.AmbientLight(0xffffff, 1.5);
        scene.add(ambient);

        // 4. Загрузка модели
        const loader = new THREE.GLTFLoader();
        loader.load(
            '../models/lapss7.glb',
            (gltf) => {
                model = gltf.scene;

                // Центрирование модели
                const box = new THREE.Box3().setFromObject(model);
                const center = box.getCenter(new THREE.Vector3());
                model.position.sub(center);
                model.traverse((child) => {
                    if (child.isMesh) {
                        child.material.metalness = 0.5;
                        child.material.roughness = 0.4;
                        child.material.envMapIntensity = 0.8;
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                });

                // Масштабирование в зависимости от ширины окна браузера
                const scaleFactor = 3;
                model.scale.set(scaleFactor, scaleFactor, scaleFactor);
                scene.add(model);

                // Настройка камеры
                const size = box.getSize(new THREE.Vector3());
                const maxDim = Math.max(size.x, size.y, size.z);
                camera.position.z = maxDim * 2.5;
            },
            undefined,
            (error) => console.error(error)
        );

        // 5. Анимация вращения
        function animate() {
            requestAnimationFrame(animate);
            if (model) {
                model.rotation.y += 0.002;
                model.rotation.x += 0.002;
            }
            renderer.render(scene, camera);
        }
        animate();

        // 6. Обработка ресайза
        window.addEventListener('resize', () => {
            updateModelContainerSize();
        });
    }

    init();
});
