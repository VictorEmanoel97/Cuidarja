// scripts/build/compile-components.js
const fs = require('fs');
const path = require('path');

// Caminhos exatos baseados na árvore estrutural do seu projeto
const modulesDir = path.join(__dirname, '../../web/modules');
const outputFile = path.join(__dirname, '../../web/core/component-registry.js');

/**
 * Adiciona o atributo de escopo ao CSS do módulo de forma inteligente.
 * Ignora diretivas especiais como @keyframes, @media e @font-face para não quebrar o layout.
 */
function scopeCSS(cssText, moduleName) {
    if (!cssText) return '';
    return cssText.replace(/([^\r\n,{}]+)(?=\s*{)/g, (match) => {
        // Se for uma regra especial do CSS (começa com @), mantém intacta
        if (match.includes('@')) return match;
        // Caso contrário, amarra o seletor estritamente ao wrapper do módulo
        return `[data-module="${moduleName}"] ${match.trim()}`;
    });
}

function compile() {
    console.log('🔨 [Build]: Iniciando a montagem do dicionário de componentes...');
    
    let registryContent = `// Gerado automaticamente pelo Build-Time. Não edite manualmente.\nexport const ComponentRegistry = {\n`;

    if (!fs.existsSync(modulesDir)) {
        console.error(`❌ Erro crítico: O diretório de módulos não foi encontrado em: ${modulesDir}`);
        return;
    }

    // Lê todas as pastas dentro de web/modules/
    const modules = fs.readdirSync(modulesDir);

    modules.forEach(mod => {
        const modPath = path.join(modulesDir, mod);
        
        if (fs.statSync(modPath).isDirectory()) {
            const htmlPath = path.join(modPath, `${mod}.view.html`);
            const cssPath = path.join(modPath, `${mod}.style.css`);

            // Captura o HTML e o CSS originais (se existirem)
            const htmlRaw = fs.existsSync(htmlPath) ? fs.readFileSync(htmlPath, 'utf8') : '';
            const cssRaw = fs.existsSync(cssPath) ? fs.readFileSync(cssPath, 'utf8') : '';

            // 1. Escapa as crases (`) do HTML para não quebrar a sintaxe da Template String do JS
            const htmlEscaped = htmlRaw.replace(/`/g, '\\`');

            // 2. Aplica o escopo no CSS do Natan e depois escapa as crases
            const cssScoped = scopeCSS(cssRaw, mod).replace(/`/g, '\\`');
            
            // 3. Monta o objeto do módulo no dicionário global
            registryContent += `    '${mod}': {
        html: \`${htmlEscaped}\`,
        css: \`${cssScoped}\`,
        controller: () => import('../modules/${mod}/${mod}.controller.js')
    },\n`;
        }
    });

    registryContent += `};\n`;

    try {
        // Garante que a pasta web/core exista antes de gravar o arquivo final
        const outputDir = path.dirname(outputFile);
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        // Grava o arquivo de registro final
        fs.writeFileSync(outputFile, registryContent, 'utf8');
        console.log('✅ [Build]: O arquivo web/core/component-registry.js foi atualizado com sucesso!');
    } catch (error) {
        console.error(`❌ Erro ao gravar o arquivo de registro: ${error.message}`);
    }
}

function scopeCSS(cssText, moduleName) {
    if (!cssText) return '';
    return cssText.replace(/([^\r\n,{}]+)(?=\s*{)/g, (match) => {
        // Se for uma regra especial como @media, @keyframes ou @font-face, não mexe
        if (match.includes('@')) return match;
        // Caso contrário, amarra ao atributo do módulo correspondente
        return `[data-module="${moduleName}"] ${match.trim()}`;
    });
}

// Executa a compilação
compile();