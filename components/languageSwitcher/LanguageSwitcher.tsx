import React, { useState } from 'react';
import i18n from '../../localization/i18n.main';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import '/node_modules/flag-icons/css/flag-icons.min.css';

const LanguageSwitcher = () => {
  const LANGUAGES = [
    { key: 'us', language: 'English' },
    { key: 'pl', language: 'Polish' },
  ];
  const [active, setActive] = useState(LANGUAGES[0]);
  const handleSelectLanguage = (chosenLanguage: string) => {
    const selectedLanguage = LANGUAGES.filter(
      (lang) => lang.key === chosenLanguage
    );
    setActive(selectedLanguage[0]);
    i18n.changeLanguage(selectedLanguage[0].key);
    (document.activeElement as HTMLElement | null)?.blur();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="outline">
          <span className={`fi fi-${active.key}`}></span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-32" align="start">
        <DropdownMenuItem className="hover:cursor-pointer">
          <a onClick={() => handleSelectLanguage('us')}>
            <span className="fi fi-us"></span> English
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem className="hover:cursor-pointer">
          <a onClick={() => handleSelectLanguage('pl')}>
            <span className="fi fi-pl"></span> Polish
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
