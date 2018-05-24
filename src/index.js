const COOKIE_NAME = 'pr-cookie-accepted';
const MAX_ZINDEX = 2147483647;
const DOMAIN_NAME = 'promorepublic.com';

const privacyPolicyLink = 'https://promorepublic.com/docs/privacy-policy.PromoRepublic.pdf?20180524';
const termsNConditionsLink = 'https://promorepublic.com/docs/terms-and-conditions.PromoRepublic.pdf?20180503';
const defaultLocale = 'en_US';

const localizations = {
  'en_US': {
    'messageMain': 'We use cookies to ensure you get the best user experience. By continuing to use our site, you accept our cookies, revised <a href="' + privacyPolicyLink + '" style="color:#fd6f29;" target="_blank">Privacy Policy</a> and <a href="'+ termsNConditionsLink +'" style="color:#fd6f29;" target="_blank">Terms of Use</a>',
    'actionAccept': 'I accept',
  }
};

const CookieHelper = {
  get: function(name) {
    var cookie = " " + document.cookie;
    var search = " " + name + "=";
    var setStr = null;
    var offset = 0;
    var end = 0;
    if (cookie.length > 0) {
      offset = cookie.indexOf(search);
      if (offset != -1) {
        offset += search.length;
        end = cookie.indexOf(";", offset);
        if (end == -1) {
          end = cookie.length;
        }
        setStr = unescape(cookie.substring(offset, end));
      }
    }
    return (setStr);
  },

  set: function(name, value, expires, path, domain, secure) {
    //if `expires` not set
    if(typeof(expires) == 'undefined') {
      const _today  = new Date();
      const _expire = new Date();
      _expire.setTime(_today.getTime() + 3600000*24*365*5);
      expires = _expire.toGMTString();
    }

    //if `path` not set
    if(typeof(path) == 'undefined') {
      path = '/';
    }

    document.cookie = name + "=" + escape(value) + ((expires) ? "; expires=" + expires : "") + ((path) ? "; path=" + path : "") + ((domain) ? "; domain=" + domain : "") + ((secure) ? "; secure" : "");
  }
};

// CookieBar widget Styles'n'Appearance
const _insertBar = function() {
  var _barShown = CookieHelper.get(COOKIE_NAME);
  if (_barShown !== null && parseInt(_barShown, 10)) {
    return;
  }

  // Wait for the Intercom iframe to become ready (max 30 seconds)
  const interconTimeout = setTimeout(() => clearInterval(intercomInterval), 30000);
  const intercomInterval = setInterval(() => {
    const iframe = document.querySelector('.intercom-launcher-frame');

    if (iframe) {
      const intercomContainer = document.querySelector('#intercom-container');
      console.log(intercomContainer);
      if (intercomContainer) {
          intercomContainer.style.zIndex = MAX_ZINDEX - 1;
      }

      clearInterval(intercomInterval);
      clearTimeout(interconTimeout);
    }
  }, 100);

  const div = document.createElement( 'div' );
        div.style.position = 'fixed';
        div.style.left = '0px';
        div.style.bottom = '0px';
        div.style.backgroundColor = '#000000';
        div.style.color = '#FFFFFF';
        div.style.width = '100%';
        div.style.fontFamily = 'Verdana, Geneva, sans-serif';
        div.style.fontSize = '14px';
        div.style.zIndex = MAX_ZINDEX;
  
  document.body.appendChild(div);

  const text = document.createElement( 'div' );
        text.style.marginRight = '150px';
        text.style.padding = '25px';
        text.innerHTML = localizations[defaultLocale].messageMain;

  div.appendChild(text);

  const button = document.createElement( 'a' );
        button.id = 'pr-cookie-bar-action-accept';
        button.style.display = 'inline-block';
        button.style.position = 'absolute';
        button.style.top = '50%';
        button.style.right = '30px';
        button.style.lineHeight = '25px';
        button.style.padding = '5px 12px';
        button.style.marginTop = '-15px';
        button.style.backgroundColor = '#ffffff';
        button.style.color = '#000000';
        button.href = 'javascript:void(0);';

        button.innerHTML = localizations[defaultLocale].actionAccept;

  div.appendChild(button);

  document.addEventListener('click', function(e) {
    if (!e.target) {
      return;
    }

    switch(e.target.id) {
      case button.id:
        const _today  = new Date();
        const _expire = new Date();
        _expire.setTime(_today.getTime() + 3600000*24*365*5);
        CookieHelper.set(COOKIE_NAME, 1, _expire.toGMTString(), '/', DOMAIN_NAME);

        document.body.removeChild(div);
        break;
      default:
        return;
    }
  });
};

// Attach Div to document body
if(window.attachEvent) {
  window.attachEvent('onload', _insertBar);
} else {
  if(window.onload) {
    const _curronload = window.onload;
    const _newonload = function(evt) {
        _curronload(evt);
        _insertBar(evt);
    };
    window.onload = _newonload;
  } else {
    window.onload = _insertBar;
  }
}