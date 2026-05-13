use std::sync::atomic::{AtomicBool, Ordering};

use tauri::{
    image::Image,
    menu::{Menu, MenuItem},
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
    AppHandle, Emitter, Manager, PhysicalPosition, Position, WindowEvent,
};

static PINNED: AtomicBool = AtomicBool::new(true);

#[derive(Clone, serde::Serialize)]
struct WidgetPosition {
    x: i32,
    y: i32,
}

fn show_widget(app: &AppHandle) {
    if let Some(window) = app.get_webview_window("main") {
        let _ = window.show();
        let _ = window.set_focus();
    }
}

fn hide_widget(app: &AppHandle) {
    if let Some(window) = app.get_webview_window("main") {
        let _ = window.hide();
    }
}

fn toggle_pin(app: &AppHandle) {
    let next = !PINNED.load(Ordering::SeqCst);
    PINNED.store(next, Ordering::SeqCst);

    if let Some(window) = app.get_webview_window("main") {
        let _ = window.set_always_on_top(next);
    }

    let _ = app.emit("pin-changed", next);
}

fn reset_position(app: &AppHandle) {
    let position = WidgetPosition { x: 980, y: 80 };

    if let Some(window) = app.get_webview_window("main") {
        let _ = window.set_position(Position::Physical(PhysicalPosition {
            x: position.x,
            y: position.y,
        }));
        let _ = window.show();
        let _ = window.set_focus();
    }

    let _ = app.emit("position-reset", position);
}

fn build_tray(app: &AppHandle) -> tauri::Result<()> {
    let show = MenuItem::with_id(app, "show", "显示小组件", true, None::<&str>)?;
    let hide = MenuItem::with_id(app, "hide", "隐藏小组件", true, None::<&str>)?;
    let pin = MenuItem::with_id(app, "pin", "固定 / 取消固定", true, None::<&str>)?;
    let reset = MenuItem::with_id(app, "reset", "重置位置", true, None::<&str>)?;
    let quit = MenuItem::with_id(app, "quit", "退出", true, None::<&str>)?;
    let menu = Menu::with_items(app, &[&show, &hide, &pin, &reset, &quit])?;
    let icon = Image::from_bytes(include_bytes!("../icons/icon.png"))?;

    TrayIconBuilder::with_id("main-tray")
        .tooltip("我的任务")
        .icon(icon)
        .menu(&menu)
        .show_menu_on_left_click(true)
        .on_menu_event(|app, event| match event.id.as_ref() {
            "show" => show_widget(app),
            "hide" => hide_widget(app),
            "pin" => toggle_pin(app),
            "reset" => reset_position(app),
            "quit" => app.exit(0),
            _ => {}
        })
        .on_tray_icon_event(|tray, event| {
            if let TrayIconEvent::Click {
                button: MouseButton::Left,
                button_state: MouseButtonState::Up,
                ..
            } = event
            {
                show_widget(&tray.app_handle());
            }
        })
        .build(app)?;

    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::default().build())
        .setup(|app| {
            build_tray(app.handle())?;
            Ok(())
        })
        .on_window_event(|window, event| {
            if let WindowEvent::CloseRequested { api, .. } = event {
                api.prevent_close();
                let _ = window.hide();
            }
        })
        .run(tauri::generate_context!())
        .expect("运行应用失败");
}
