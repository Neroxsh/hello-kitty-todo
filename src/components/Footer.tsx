import sparkleAndHeart from "../assets/icons/sparkle_and_heart.png";

interface FooterProps {
  pinned: boolean;
  onTogglePinned: () => void;
}

export function Footer({ pinned, onTogglePinned }: FooterProps) {
  return (
    <footer className="widget-footer">
      <img src={sparkleAndHeart} alt="" aria-hidden="true" />
      <button type="button" title={pinned ? "取消固定" : "固定在桌面"} onClick={onTogglePinned}>
        ♡ {pinned ? "已固定在桌面" : "固定到桌面"} ♡
      </button>
      <img src={sparkleAndHeart} alt="" aria-hidden="true" />
    </footer>
  );
}
