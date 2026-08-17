import { 
  FaCogs,
 
  FaTags,
  FaShoppingCart,
  FaBuilding, 
  FaLayerGroup

} from 'react-icons/fa';

import { PiCurrencyDollarLight } from "react-icons/pi";
import { ImUsers } from "react-icons/im";
import { FaSortAmountUp } from "react-icons/fa";
import { FaSortAmountUpAlt } from "react-icons/fa";
import { GrTransaction } from "react-icons/gr";
import { ImCalculator } from "react-icons/im";
import { FaCommentsDollar } from "react-icons/fa";
import { AiFillContainer } from "react-icons/ai";
import { IoSettingsSharp } from "react-icons/io5";


import { IoIosCart } from "react-icons/io";
import { BsUnity } from "react-icons/bs";
import { FaSitemap } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { AiOutlinePartition } from "react-icons/ai";


import { LuScale } from "react-icons/lu";
import { GiWoodenFence } from "react-icons/gi";
import { FaUsers } from "react-icons/fa";
import { BsBuildingsFill } from "react-icons/bs";

export const SidebarMenuLinks = [
  {
    name: "الرئيسية",
    path: "/dashboard",
    icon: MdDashboard,
  },

  {
    name: "الوحدات",
    path: "/units",
    icon: LuScale,
  },

  {
    name: "الاصناف",
    path: "/items",
    icon: GiWoodenFence,
  },


  {
    name: "جهات الاتصال",
    path: "/contacts",
    icon: FaUsers,
  },

  {
    name: "المشاريع",
    path: "/projects",
    icon: BsBuildingsFill,
  },

  {
    name: "المشتروات",
    path: "/invoice",
    icon: IoIosCart,
  },

  {
    name: "المالية",
    path: "#",
    icon: ImCalculator,

    isExpanded: false,
    subItems: [
      {
        name: "الموقف المالي",
        path: "#",
        icon: GrTransaction
      },
      {
        name: "الايرادات",
        path: "#",
        icon: FaSortAmountUp
      },
      {
        name: "المصروفات",
        path: "#",
        icon: FaSortAmountUpAlt
      },
     
    ]
  },
  

  
];

