import React, { useState } from 'react';
import i18n from '../../localization/i18n.main';

import '/node_modules/flag-icons/css/flag-icons.min.css';

const LanguageSwitcher = () => {
  const LANGUAGES = [
    { key: 'us', language: 'English' },
    { key: 'pl', language: 'Polish' },
  ];
  const [active, setActive] = useState(LANGUAGES[0]);
  const handleSelectLanguage = (chosenLanguage: string) => {
    console.log(LANGUAGES);
    const selectedLanguage = LANGUAGES.filter(
      (lang) => lang.key === chosenLanguage
    );
    setActive(selectedLanguage[0]);
    i18n.changeLanguage(selectedLanguage[0].key);
    (document.activeElement as HTMLElement | null)?.blur();
  };

  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn m-1">
        <span className={`fi fi-${active.key}`}></span>
        {active.language}
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content menu bg-white text-neutral font-bold rounded-box z-1 w-52 p-2 shadow-sm"
      >
        <li>
          <a onClick={() => handleSelectLanguage('us')}>
            <span className="fi fi-us"></span> English
          </a>
        </li>
        <li>
          <a onClick={() => handleSelectLanguage('pl')}>
            <span className="fi fi-pl"></span> Polish
          </a>
        </li>
      </ul>
    </div>
  );
};

export default LanguageSwitcher;
