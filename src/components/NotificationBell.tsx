import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../hooks/useNotifications";
import {
  Wrapper,
  BellButton,
  Badge,
  Dropdown,
  DropdownHeader,
  HeaderTitle,
  MarkAllButton,
  EmptyText,
  NotificationItem,
  ItemTitle,
  ItemMessage,
} from "./style/NotificationBell.style";

function BellIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2C10.34 2 9 3.34 9 5V5.29C6.61 6.13 5 8.38 5 11V16L3 18V19H21V18L19 16V11C19 8.38 17.39 6.13 15 5.29V5C15 3.34 13.66 2 12 2ZM12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function NotificationBell() {
  const { notifications, unreadCount, markRead, markAllRead } =
    useNotifications();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(e: MouseEvent) {
      if (!wrapperRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <Wrapper ref={wrapperRef}>
      <BellButton type="button" onClick={() => setOpen((v) => !v)}>
        <BellIcon />
        {unreadCount > 0 && (
          <Badge>{unreadCount > 9 ? "9+" : unreadCount}</Badge>
        )}
      </BellButton>

      {open && (
        <>
          <Dropdown>
            <DropdownHeader>
              <HeaderTitle>알림</HeaderTitle>
              {notifications.length > 0 && (
                <MarkAllButton type="button" onClick={markAllRead}>
                  모두 읽음
                </MarkAllButton>
              )}
            </DropdownHeader>
            {notifications.length === 0 ? (
              <EmptyText>아직 알림이 없어요.</EmptyText>
            ) : (
              notifications.map((n) => (
                <NotificationItem
                  key={n.id}
                  type="button"
                  $read={n.read}
                  onClick={() => {
                    markRead(n.id);
                    setOpen(false);
                    if (n.linkTo) navigate(n.linkTo);
                  }}
                >
                  <ItemTitle>{n.title}</ItemTitle>
                  <ItemMessage>{n.message}</ItemMessage>
                </NotificationItem>
              ))
            )}
          </Dropdown>
        </>
      )}
    </Wrapper>
  );
}
