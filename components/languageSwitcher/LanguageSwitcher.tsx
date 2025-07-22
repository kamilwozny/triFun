import React from 'react';
import i18n from '../../localization/i18n.main';

const LanguageSwitcher = () => {
  return (
    <div>
      <button onClick={() => i18n.changeLanguage('en')}>English</button>
      <button onClick={() => i18n.changeLanguage('pl')}>Polish</button>
    </div>
  );
};

export default LanguageSwitcher;
