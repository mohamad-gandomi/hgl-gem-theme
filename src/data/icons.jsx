import React from 'react'
import Award from 'lucide-react/dist/esm/icons/award.mjs'
import BadgeCheck from 'lucide-react/dist/esm/icons/badge-check.mjs'
import BriefcaseBusiness from 'lucide-react/dist/esm/icons/briefcase-business.mjs'
import Gavel from 'lucide-react/dist/esm/icons/gavel.mjs'
import Gem from 'lucide-react/dist/esm/icons/gem.mjs'
import GraduationCap from 'lucide-react/dist/esm/icons/graduation-cap.mjs'
import History from 'lucide-react/dist/esm/icons/history.mjs'
import Home from 'lucide-react/dist/esm/icons/home.mjs'
import Info from 'lucide-react/dist/esm/icons/info.mjs'
import MessagesSquare from 'lucide-react/dist/esm/icons/messages-square.mjs'
import Newspaper from 'lucide-react/dist/esm/icons/newspaper.mjs'
import Palette from 'lucide-react/dist/esm/icons/palette.mjs'
import PhoneCall from 'lucide-react/dist/esm/icons/phone-call.mjs'
import Scale from 'lucide-react/dist/esm/icons/scale.mjs'
import UserRoundCheck from 'lucide-react/dist/esm/icons/user-round-check.mjs'

export const navIcons = {
  '/': Home,
  '/about': Info,
  '/services': BriefcaseBusiness,
  '/blog': Newspaper,
  '/contact': PhoneCall
}

export const whyIcons = [History, Award, BadgeCheck, GraduationCap]
export const memberIcons = [UserRoundCheck, Palette, Scale]
export const serviceIcons = [Gem, Gavel, GraduationCap, MessagesSquare]
