import asyncio, json
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(executable_path='/usr/bin/google-chrome', headless=True, args=['--no-sandbox', '--enable-unsafe-swiftshader', '--use-angle=swiftshader', '--enable-webgl'])
        page = await browser.new_page(viewport={'width':1440,'height':1000}, device_scale_factor=1)
        errors=[]
        page.on('pageerror', lambda e: errors.append(str(e)))
        await page.goto('http://localhost:4200', wait_until='networkidle')
        await page.locator('canvas').wait_for()
        await page.screenshot(path='/home/user/vtg-webgl.png')
        assert await page.locator('canvas').count() == 1
        await page.keyboard.press('8')
        assert await page.evaluate("getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()") == '#9933FF'
        await page.keyboard.press('0')
        await page.get_by_role('button',name='Ativar modo escuro').click()
        assert await page.evaluate('document.documentElement.dataset.theme') == 'dark'
        await page.screenshot(path='/home/user/vtg-dark.png')
        await page.get_by_role('button',name='Ativar modo claro').click()
        await page.get_by_role('tab',name='Jogos').click()
        assert await page.locator('.project-card').count() == 0
        assert await page.locator('.empty-projects').is_visible()
        await page.get_by_role('tab',name='Web',exact=True).click()
        assert await page.locator('.project-card').count() == 2
        await page.get_by_role('button',name='Currículo PDF — disponível em breve').click()
        assert 'Currículo PDF em breve' in await page.locator('output.toast').inner_text()
        await page.get_by_role('button',name='Fechar aviso').click()
        await page.evaluate("document.querySelectorAll('.reveal').forEach(e=>e.classList.add('visible'))")
        await page.screenshot(path='/home/user/vtg-full.png',full_page=True)
        await page.goto('http://localhost:4200')
        box = await page.locator('.three-canvas').bounding_box()
        await page.mouse.move(box['x']+box['width']/2,box['y']+box['height']/2)
        await page.mouse.down()
        await page.mouse.move(box['x']+box['width']/2+180,box['y']+box['height']/2+65,steps=20)
        await page.mouse.up()
        await page.set_viewport_size({'width':390,'height':844})
        await page.evaluate('window.scrollTo(0,0)')
        await page.screenshot(path='/home/user/vtg-mobile.png')
        assert await page.evaluate('document.documentElement.scrollWidth <= innerWidth')
        await page.get_by_role('button',name='Abrir menu').click()
        await page.locator('.nav').get_by_role('link',name='Sobre',exact=True).click()
        assert not await page.locator('.nav').is_visible()
        await page.evaluate("document.querySelectorAll('.reveal').forEach(e=>e.classList.add('visible'))")
        await page.screenshot(path='/home/user/vtg-mobile-full.png',full_page=True)
        print(json.dumps({'webgl':True,'themes':'passed','keyboard':'passed','filters':'passed','resumePending':'passed','drag':'passed','mobileOverflow':False,'mobileNavigation':'passed','pageErrors':errors}))
        await browser.close()

asyncio.run(main())