import styled from 'styled-components'
import { CORAL, LAVENDER } from './theme'

export type TabId = 'home' | 'map' | 'capsule' | 'chronicle' | 'tag'

const TABS: { id: TabId; label: string }[] = [
  { id: 'home', label: 'Timeline' },
  { id: 'map', label: 'Map View' },
  { id: 'capsule', label: 'Time Capsule' },
  { id: 'chronicle', label: 'AI Chronicle' },
  { id: 'tag', label: 'Anonymous Tagging' },
]

function TabIcon({ id }: { id: TabId }) {
  switch (id) {
    case 'home':
      return (
        <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18.5002 8.25023C18.5002 8.08608 18.4678 7.92354 18.405 7.77188C18.3422 7.62022 18.2501 7.48242 18.134 7.36635C18.018 7.25028 17.8802 7.1582 17.7285 7.09538C17.5769 7.03257 17.4143 7.00023 17.2502 7.00023C17.086 7.00023 16.9235 7.03257 16.7718 7.09538C16.6202 7.1582 16.4824 7.25028 16.3663 7.36635C16.2502 7.48242 16.1581 7.62022 16.0953 7.77188C16.0325 7.92354 16.0002 8.08608 16.0002 8.25023H18.5002ZM4.50016 8.25023C4.50016 7.91871 4.36847 7.60077 4.13405 7.36635C3.89963 7.13193 3.58169 7.00023 3.25016 7.00023C2.91864 7.00023 2.6007 7.13193 2.36628 7.36635C2.13186 7.60077 2.00016 7.91871 2.00016 8.25023H4.50016ZM18.3662 11.1342C18.6006 11.3687 18.9186 11.5004 19.2502 11.5004C19.5817 11.5004 19.8997 11.3687 20.1342 11.1342C20.3686 10.8998 20.5003 10.5818 20.5003 10.2502C20.5003 9.91867 20.3686 9.60068 20.1342 9.36623L18.3662 11.1342ZM10.2502 1.25023L11.1342 0.366233C11.0181 0.250125 10.8803 0.158021 10.7286 0.0951821C10.5769 0.0323431 10.4143 0 10.2502 0C10.086 0 9.92341 0.0323431 9.77173 0.0951821C9.62006 0.158021 9.48224 0.250125 9.36617 0.366233L10.2502 1.25023ZM0.366165 9.36623C0.131713 9.60068 0 9.91867 0 10.2502C0 10.5818 0.131713 10.8998 0.366165 11.1342C0.600616 11.3687 0.9186 11.5004 1.25016 11.5004C1.58173 11.5004 1.89971 11.3687 2.13416 11.1342L0.366165 9.36623ZM5.25016 20.5002H15.2502V18.0002H5.25016V20.5002ZM18.5002 17.2502V8.25023H16.0002V17.2502H18.5002ZM4.50016 17.2502V8.25023H2.00016V17.2502H4.50016ZM20.1342 9.36623L11.1342 0.366233L9.36617 2.13423L18.3662 11.1342L20.1342 9.36623ZM9.36617 0.366233L0.366165 9.36623L2.13416 11.1342L11.1342 2.13423L9.36617 0.366233ZM15.2502 20.5002C16.1121 20.5002 16.9388 20.1578 17.5483 19.5483C18.1578 18.9388 18.5002 18.1122 18.5002 17.2502H16.0002C16.0002 17.4491 15.9211 17.6399 15.7805 17.7806C15.6398 17.9212 15.4491 18.0002 15.2502 18.0002V20.5002ZM5.25016 18.0002C5.05125 18.0002 4.86049 17.9212 4.71983 17.7806C4.57918 17.6399 4.50016 17.4491 4.50016 17.2502H2.00016C2.00016 18.1122 2.34257 18.9388 2.95207 19.5483C3.56156 20.1578 4.38821 20.5002 5.25016 20.5002V18.0002Z" fill="currentColor" />
        </svg>
      )
    case 'map':
      return (
        <svg width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8.00009 12C10.2061 12 12.0001 10.206 12.0001 8C12.0001 5.794 10.2061 4 8.00009 4C5.79409 4 4.00009 5.794 4.00009 8C4.00009 10.206 5.79409 12 8.00009 12ZM8.00009 6C9.10309 6 10.0001 6.897 10.0001 8C10.0001 9.103 9.10309 10 8.00009 10C6.89709 10 6.00009 9.103 6.00009 8C6.00009 6.897 6.89709 6 8.00009 6Z" fill="currentColor" />
          <path d="M7.42009 19.814C7.58945 19.9346 7.79218 19.9994 8.00009 19.9994C8.20799 19.9994 8.41073 19.9346 8.58009 19.814C8.88409 19.599 16.0291 14.44 16.0001 8C16.0001 3.589 12.4111 0 8.00009 0C3.58909 0 8.80377e-05 3.589 8.80377e-05 7.995C-0.028912 14.44 7.11609 19.599 7.42009 19.814ZM8.00009 2C11.3091 2 14.0001 4.691 14.0001 8.005C14.0211 12.443 9.61209 16.428 8.00009 17.735C6.38909 16.427 1.97909 12.441 2.00009 8C2.00009 4.691 4.69109 2 8.00009 2Z" fill="currentColor" />
        </svg>
      )
    case 'capsule':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19.779 4.22201C20.9041 5.34722 21.5362 6.87328 21.5362 8.46451C21.5362 10.0557 20.9041 11.5818 19.779 12.707L17.657 14.827L12.707 19.778C11.5787 20.8881 10.0574 21.5074 8.47459 21.5009C6.89177 21.4945 5.37562 20.8628 4.25638 19.7436C3.13715 18.6244 2.50552 17.1082 2.49907 15.5254C2.49263 13.9426 3.11189 12.4213 4.22197 11.293L11.293 4.22201C11.8501 3.66475 12.5116 3.22271 13.2396 2.92111C13.9677 2.61952 14.748 2.46429 15.536 2.46429C16.324 2.46429 17.1043 2.61952 17.8323 2.92111C18.5603 3.22271 19.2218 3.66475 19.779 4.22201ZM14.829 14.828L9.17197 9.17201L5.63597 12.707C4.88581 13.4572 4.46437 14.4746 4.46437 15.5355C4.46437 16.5964 4.88581 17.6138 5.63597 18.364C6.38614 19.1142 7.40358 19.5356 8.46447 19.5356C9.52537 19.5356 10.5428 19.1142 11.293 18.364L14.829 14.828Z" fill="currentColor" />
        </svg>
      )
    case 'chronicle':
      return (
        <svg width="20" height="22" viewBox="0 0 20 22" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7.01238 3.448C7.61038 1.698 10.0284 1.645 10.7374 3.289L10.7974 3.449L11.6044 5.809C11.7893 6.35023 12.0882 6.84551 12.4808 7.26142C12.8734 7.67734 13.3507 8.00421 13.8804 8.22L14.0974 8.301L16.4574 9.107C18.2074 9.705 18.2604 12.123 16.6174 12.832L16.4574 12.892L14.0974 13.699C13.556 13.8838 13.0605 14.1826 12.6444 14.5753C12.2283 14.9679 11.9013 15.4452 11.6854 15.975L11.6044 16.191L10.7984 18.552C10.2004 20.302 7.78238 20.355 7.07438 18.712L7.01238 18.552L6.20638 16.192C6.02156 15.6506 5.72275 15.1551 5.33012 14.739C4.93749 14.3229 4.46017 13.9959 3.93038 13.78L3.71438 13.699L1.35438 12.893C-0.396622 12.295 -0.449622 9.877 1.19438 9.169L1.35438 9.107L3.71438 8.301C4.25561 8.11606 4.75089 7.81719 5.1668 7.42457C5.58271 7.03195 5.90959 6.55469 6.12538 6.025L6.20638 5.809L7.01238 3.448ZM8.90538 4.094L8.09938 6.454C7.81777 7.2793 7.35965 8.0333 6.75691 8.6635C6.15418 9.29369 5.42132 9.78493 4.60938 10.103L4.35938 10.194L1.99938 11L4.35938 11.806C5.18468 12.0876 5.93868 12.5457 6.56887 13.1485C7.19907 13.7512 7.6903 14.4841 8.00838 15.296L8.09938 15.546L8.90538 17.906L9.71138 15.546C9.99299 14.7207 10.4511 13.9667 11.0538 13.3365C11.6566 12.7063 12.3894 12.2151 13.2014 11.897L13.4514 11.807L15.8114 11L13.4514 10.194C12.6261 9.91239 11.8721 9.45427 11.2419 8.85154C10.6117 8.2488 10.1205 7.51595 9.80238 6.704L9.71238 6.454L8.90538 4.094ZM16.9054 1.80688e-07C17.0925 -2.35972e-07 17.2758 0.0524783 17.4345 0.151472C17.5933 0.250465 17.7211 0.392003 17.8034 0.56L17.8514 0.677L18.2014 1.703L19.2284 2.053C19.4159 2.1167 19.5802 2.23462 19.7006 2.39182C19.821 2.54902 19.892 2.73842 19.9047 2.93602C19.9173 3.13362 19.871 3.33053 19.7716 3.50179C19.6722 3.67304 19.5242 3.81094 19.3464 3.898L19.2284 3.946L18.2024 4.296L17.8524 5.323C17.7886 5.51043 17.6706 5.6747 17.5133 5.79499C17.356 5.91529 17.1666 5.98619 16.969 5.99872C16.7714 6.01125 16.5746 5.96484 16.4034 5.86538C16.2322 5.76591 16.0944 5.61787 16.0074 5.44L15.9594 5.323L15.6094 4.297L14.5824 3.947C14.3949 3.8833 14.2305 3.76538 14.1101 3.60819C13.9898 3.45099 13.9187 3.26158 13.9061 3.06398C13.8935 2.86638 13.9398 2.66947 14.0392 2.49821C14.1385 2.32696 14.2865 2.18906 14.4644 2.102L14.5824 2.054L15.6084 1.704L15.9584 0.677C16.0258 0.479426 16.1534 0.307909 16.3232 0.186499C16.493 0.065089 16.6966 -0.000125281 16.9054 1.80688e-07Z" fill="currentColor" />
        </svg>
      )
    case 'tag':
      return (
        <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1.38365 4.28006L1.05265 7.92406C1.00265 8.46406 0.978648 8.73506 1.02265 8.99406C1.06304 9.22464 1.14359 9.44634 1.26065 9.64906C1.39165 9.87706 1.58565 10.0711 1.97165 10.4571L7.14765 15.6331C7.93465 16.4201 8.32765 16.8131 8.78365 16.9611C9.18565 17.0921 9.61865 17.0921 10.0206 16.9611C10.4766 16.8131 10.8736 16.4171 11.6656 15.6251L15.6256 11.6651C16.4176 10.8731 16.8126 10.4771 16.9616 10.0211C17.0918 9.61929 17.0915 9.18662 16.9606 8.78506C16.8126 8.32806 16.4176 7.93206 15.6256 7.14006L10.4626 1.97706C10.0726 1.58706 9.87865 1.39306 9.64965 1.26106C9.44662 1.1439 9.22457 1.06334 8.99365 1.02306C8.73365 0.978059 8.45865 1.00306 7.90965 1.05306L4.27965 1.38306C3.33565 1.46906 2.86265 1.51206 2.49265 1.71806C2.16719 1.89919 1.89878 2.1676 1.71765 2.49306C1.51265 2.86106 1.46965 3.33106 1.38465 4.26606L1.38365 4.28006Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6.56536 6.02351C6.51514 6.14487 6.44151 6.25516 6.34866 6.34807C6.16116 6.53571 5.90679 6.64118 5.64152 6.64127C5.51017 6.64132 5.3801 6.6155 5.25873 6.56527C5.13736 6.51505 5.02707 6.44142 4.93416 6.34857C4.84125 6.25573 4.76754 6.14549 4.71723 6.02416C4.66692 5.90283 4.64101 5.77277 4.64096 5.64143C4.64087 5.37616 4.74616 5.12171 4.93366 4.93407C5.02651 4.84116 5.13674 4.76745 5.25808 4.71714C5.37941 4.66683 5.50946 4.64092 5.64081 4.64087C5.77216 4.64082 5.90223 4.66665 6.0236 4.71687C6.14497 4.76709 6.25525 4.84073 6.34816 4.93357C6.44107 5.02642 6.51479 5.13665 6.56509 5.25798C6.6154 5.37932 6.64132 5.50937 6.64137 5.64072C6.64141 5.77207 6.61559 5.90214 6.56536 6.02351Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
  }
}

function ChevronIcon() {
  return (
    <svg width="8" height="13" viewBox="0 0 8 13" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M7.071 7.071L1.414 12.728L0 11.314L4.95 6.364L0 1.414L1.414 0L7.071 5.657C7.25847 5.84453 7.36379 6.09884 7.36379 6.364C7.36379 6.62916 7.25847 6.88347 7.071 7.071Z" fill="currentColor" />
    </svg>

  )
}

const Wrap = styled.div<{ $expanded: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 30;
  width: ${(p) => (p.$expanded ? 240 : 84)}px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 22px 16px;
  box-sizing: border-box;
  transition: width 0.22s ease;
  background:
    linear-gradient(165deg, rgba(150,175,200,0.55) 0%, rgba(116,141,166,0.68) 40%, rgba(116,141,166,0.55) 100%),
    radial-gradient(70% 40% at 20% 0%, rgba(255,255,255,0.3), transparent 60%);
  backdrop-filter: blur(30px) saturate(200%);
  -webkit-backdrop-filter: blur(30px) saturate(200%);
  border-right: 1.5px solid rgba(255,255,255,0.4);
  box-shadow: inset 1px 0 0 rgba(255,255,255,0.35), inset -6px 0 16px rgba(20,40,70,0.12), 10px 0 34px rgba(20,30,45,0.18);
`

const Header = styled.div<{ $expanded: boolean }>`
  display: flex;
  align-items: center;
  justify-content: ${(p) => (p.$expanded ? 'space-between' : 'center')};
  flex-wrap: wrap;
  gap: 8px;
  padding: 4px 4px;
`

const Brand = styled.div`
  font-size: 19px;
  font-weight: 800;
  color: #fff;
  letter-spacing: -0.5px;
  font-style: italic;
`

const CollapseButton = styled.button<{ $expanded: boolean }>`
  width: 26px;
  height: 26px;
  border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.35);
  background: rgba(255,255,255,0.15);
  color: #fff;
  cursor: pointer;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    transform: rotate(${(p) => (p.$expanded ? 0 : 180)}deg);
    transition: transform 0.22s ease;
  }
`

const ProfileCard = styled.div<{ $expanded: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 18px;
  background: rgba(255,255,255,0.15);
  border: 1px solid rgba(255,255,255,0.25);
  justify-content: ${(p) => (p.$expanded ? 'flex-start' : 'center')};
`

const Avatar = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 50%;
  flex-shrink: 0;
  background: linear-gradient(135deg, ${LAVENDER}, ${CORAL});
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
`

const ProfileTextWrap = styled.div`
  min-width: 0;
`

const ProfileName = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: #fff;
  white-space: nowrap;
`

const ProfileRole = styled.div`
  font-size: 12px;
  color: rgba(255,255,255,0.65);
  margin-top: 2px;
  white-space: nowrap;
`

const MenuList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
`

const TabRow = styled.div<{ $expanded: boolean; $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 14px;
  cursor: pointer;
  padding: ${(p) => (p.$expanded ? '11px 14px' : '11px 0')};
  border-radius: 14px;
  justify-content: ${(p) => (p.$expanded ? 'flex-start' : 'center')};
  background: ${(p) => (p.$active ? 'rgba(255,255,255,0.32)' : 'transparent')};
  box-shadow: ${(p) => (p.$active ? 'inset 0 1px 0 rgba(255,255,255,0.4), 0 4px 12px rgba(20,30,45,0.15)' : 'none')};
  transition: all 0.18s ease;
`

const IconWrap = styled.div<{ $active: boolean }>`
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: ${(p) => (p.$active ? '#fff' : 'rgba(255,255,255,0.75)')};
`

const TabLabel = styled.div<{ $active: boolean }>`
  font-size: 14px;
  font-weight: ${(p) => (p.$active ? 700 : 500)};
  color: ${(p) => (p.$active ? '#fff' : 'rgba(255,255,255,0.75)')};
  white-space: nowrap;
`

type SideBarProps = {
  expanded: boolean
  activeTab: TabId
  onToggle: () => void
  onNavigate: (tab: TabId) => void
}

export default function SideBar({ expanded, activeTab, onToggle, onNavigate }: SideBarProps) {
  return (
    <Wrap $expanded={expanded}>
      <Header $expanded={expanded}>
        <Brand>{expanded ? 'Drchive' : 'D'}</Brand>
        <CollapseButton type="button" $expanded={expanded} onClick={onToggle}>
          <ChevronIcon />
        </CollapseButton>
      </Header>

      <ProfileCard $expanded={expanded}>
        <Avatar>JY</Avatar>
        {expanded && (
          <ProfileTextWrap>
            <ProfileName>Yujin Jung</ProfileName>
            <ProfileRole>Grade 3, Class 2</ProfileRole>
          </ProfileTextWrap>
        )}
      </ProfileCard>

      <MenuList>
        {TABS.map((t) => {
          const active = activeTab === t.id
          return (
            <TabRow key={t.id} $expanded={expanded} $active={active} onClick={() => onNavigate(t.id)}>
              <IconWrap $active={active}>
                <TabIcon id={t.id} />
              </IconWrap>
              {expanded && <TabLabel $active={active}>{t.label}</TabLabel>}
            </TabRow>
          )
        })}
      </MenuList>
    </Wrap>
  )
}
