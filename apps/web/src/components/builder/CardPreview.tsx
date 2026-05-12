import { TrendingUp, TrendingDown, Minus, ShoppingCart, Star, MapPin, Link } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useBuilderStore } from '@/stores/builder.store'

const SHADOW_CLASSES = {
  none: '',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
}

const ROUNDED_CLASSES = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
}

function ActionButton({ label, variant }: { label: string; variant: string }) {
  if (variant === 'primary') {
    return (
      <button className="rounded-md bg-brand-600 px-4 py-2 text-xs font-medium text-white hover:bg-brand-800">
        {label}
      </button>
    )
  }
  if (variant === 'ghost') {
    return (
      <button className="rounded-md px-4 py-2 text-xs font-medium text-neutral-600 hover:bg-neutral-100">
        {label}
      </button>
    )
  }
  return (
    <button className="rounded-md border border-neutral-200 px-4 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-50">
      {label}
    </button>
  )
}

function BasicCard() {
  const { cardConfig } = useBuilderStore()
  const { title, subtitle, description, showImage, showAvatar, showBadge, badgeText, showFooter, showDivider, actions, shadow, rounded } = cardConfig

  return (
    <div className={cn('w-full max-w-sm border border-neutral-200 bg-white', SHADOW_CLASSES[shadow], ROUNDED_CLASSES[rounded])}>
      {showImage && (
        <div className="flex h-40 w-full items-center justify-center bg-gradient-to-br from-brand-100 to-brand-200 text-sm text-brand-400">
          Image placeholder
        </div>
      )}
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {showAvatar && (
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-600">
                {title.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h3 className="text-sm font-semibold text-neutral-900">{title}</h3>
              <p className="text-xs text-neutral-500">{subtitle}</p>
            </div>
          </div>
          {showBadge && (
            <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-medium text-brand-600">
              {badgeText}
            </span>
          )}
        </div>
        {description && <p className="mt-3 text-xs leading-relaxed text-neutral-600">{description}</p>}
      </div>
      {showDivider && <div className="border-t border-neutral-100" />}
      {showFooter && actions.length > 0 && (
        <div className="flex items-center justify-end gap-2 px-5 py-3">
          {actions.map((a) => <ActionButton key={a.id} label={a.label} variant={a.variant} />)}
        </div>
      )}
    </div>
  )
}

function ProfileCard() {
  const { cardConfig } = useBuilderStore()
  const { title, subtitle, description, showBadge, badgeText, showFooter, showDivider, actions, shadow, rounded } = cardConfig

  return (
    <div className={cn('w-full max-w-sm border border-neutral-200 bg-white', SHADOW_CLASSES[shadow], ROUNDED_CLASSES[rounded])}>
      <div className="h-20 bg-gradient-to-r from-brand-400 to-brand-600" />
      <div className="px-5 pb-5">
        <div className="-mt-8 flex items-end justify-between">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-brand-100 text-xl font-bold text-brand-600">
            {title.charAt(0).toUpperCase()}
          </div>
          {showBadge && (
            <span className="rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-medium text-green-600">
              {badgeText}
            </span>
          )}
        </div>
        <div className="mt-3">
          <h3 className="text-sm font-semibold text-neutral-900">{title}</h3>
          <p className="text-xs text-neutral-500">{subtitle}</p>
        </div>
        {description && <p className="mt-2 text-xs leading-relaxed text-neutral-600">{description}</p>}
        <div className="mt-3 flex items-center gap-3 text-[11px] text-neutral-400">
          <span className="flex items-center gap-1"><MapPin size={11} /> San Francisco, CA</span>
          <span className="flex items-center gap-1"><Link size={11} /> portfolio.dev</span>
        </div>
        <div className="mt-3 flex gap-3 border-t border-neutral-100 pt-3 text-center text-xs">
          <div><p className="font-semibold text-neutral-800">128</p><p className="text-neutral-400">Posts</p></div>
          <div><p className="font-semibold text-neutral-800">4.2k</p><p className="text-neutral-400">Followers</p></div>
          <div><p className="font-semibold text-neutral-800">312</p><p className="text-neutral-400">Following</p></div>
        </div>
      </div>
      {showDivider && <div className="border-t border-neutral-100" />}
      {showFooter && actions.length > 0 && (
        <div className="flex gap-2 px-5 py-3">
          {actions.map((a) => <ActionButton key={a.id} label={a.label} variant={a.variant} />)}
        </div>
      )}
    </div>
  )
}

function StatsCard() {
  const { cardConfig } = useBuilderStore()
  const { title, stats, showBadge, badgeText, shadow, rounded } = cardConfig

  return (
    <div className={cn('w-full max-w-2xl border border-neutral-200 bg-white', SHADOW_CLASSES[shadow], ROUNDED_CLASSES[rounded])}>
      <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
        <h3 className="text-sm font-semibold text-neutral-900">{title}</h3>
        {showBadge && (
          <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-medium text-brand-600">{badgeText}</span>
        )}
      </div>
      <div className="grid grid-cols-2 divide-x divide-y divide-neutral-100">
        {stats.map((stat) => (
          <div key={stat.id} className="flex flex-col gap-1 p-5">
            <p className="text-xs text-neutral-500">{stat.label}</p>
            <p className="text-2xl font-bold text-neutral-900">{stat.value}</p>
            {stat.change && (
              <div className={cn('flex items-center gap-1 text-[11px] font-medium', {
                'text-green-600': stat.trend === 'up',
                'text-red-500': stat.trend === 'down',
                'text-neutral-400': stat.trend === 'neutral',
              })}>
                {stat.trend === 'up' && <TrendingUp size={11} />}
                {stat.trend === 'down' && <TrendingDown size={11} />}
                {stat.trend === 'neutral' && <Minus size={11} />}
                {stat.change} from last month
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function ProductCard() {
  const { cardConfig } = useBuilderStore()
  const { title, subtitle, description, showBadge, badgeText, showFooter, showDivider, actions, shadow, rounded } = cardConfig

  return (
    <div className={cn('w-full max-w-xs border border-neutral-200 bg-white', SHADOW_CLASSES[shadow], ROUNDED_CLASSES[rounded])}>
      <div className="relative">
        <div className="flex h-48 w-full items-center justify-center bg-gradient-to-br from-neutral-100 to-neutral-200">
          <ShoppingCart size={32} className="text-neutral-300" />
        </div>
        {showBadge && (
          <span className="absolute left-3 top-3 rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-medium text-white">
            {badgeText}
          </span>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-sm font-semibold text-neutral-900">{title}</h3>
            <p className="text-xs text-neutral-500">{subtitle}</p>
          </div>
          <div className="flex items-center gap-0.5 text-amber-400">
            <Star size={11} fill="currentColor" />
            <span className="text-[11px] font-medium text-neutral-600">4.8</span>
          </div>
        </div>
        {description && <p className="mt-2 text-xs leading-relaxed text-neutral-500">{description}</p>}
        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-bold text-neutral-900">$49.99</span>
          <span className="text-xs text-neutral-400 line-through">$79.99</span>
        </div>
      </div>
      {showDivider && <div className="border-t border-neutral-100" />}
      {showFooter && (
        <div className="flex gap-2 p-4">
          {actions.length > 0
            ? actions.map((a) => <ActionButton key={a.id} label={a.label} variant={a.variant} />)
            : <button className="w-full rounded-md bg-brand-600 py-2 text-xs font-medium text-white">Add to cart</button>
          }
        </div>
      )}
    </div>
  )
}

export function CardPreview() {
  const { cardConfig } = useBuilderStore()

  const CardComponent = {
    basic: BasicCard,
    profile: ProfileCard,
    stats: StatsCard,
    product: ProductCard,
  }[cardConfig.cardType]

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-neutral-50">
      <div className="flex h-10 flex-shrink-0 items-center gap-2 border-b border-neutral-200 bg-white px-4">
        <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
        <span className="text-xs font-medium text-neutral-500">Live preview</span>
        <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-medium text-brand-600 capitalize">
          {cardConfig.cardType} card
        </span>
      </div>
      <div className="flex flex-1 items-center justify-center overflow-y-auto p-8">
        <CardComponent />
      </div>
    </div>
  )
}
