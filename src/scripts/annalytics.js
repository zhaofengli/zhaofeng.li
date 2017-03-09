/**
 *     _                      _       _   _
 *    / \   _ __  _ __   __ _| |_   _| |_(_) ___ ___
 *   / _ \ | '_ \| '_ \ / _` | | | | | __| |/ __/ __|
 *  / ___ \| | | | | | | (_| | | |_| | |_| | (__\__ \
 * /_/   \_\_| |_|_| |_|\__,_|_|\__, |\__|_|\___|___/
 *                              |___/
 *
 *      (I swear I didn't spell that wrong)
 *
 *
 *
 *
 *
 * Umm, well, because this is totally not analytics :P
 */

const answers = __ANNALYTICS__;
const annasalt = 'whatamidoing';

$(document).ready(() => {
  let tmpl = `
    <dialog id="super-secret-evil-dialog" class="mdl-dialog">
      <div class="mdl-dialog__content">
        <div class="mdl-textfield mdl-js-textfield">
          <input class="mdl-textfield__input" type="text" id="evil-command">
          <label class="mdl-textfield__label" for="evil-command">wat</label>
        </div>
        <p id="evil-answer"></p>
      </div>
      <div class="mdl-dialog__actions">
        <button type="button" class="mdl-button close">Close</button>
      </button>
    </dialog>
  `;
  $('#dotfiles .mdl-card__actions').append(tmpl);
  let dialog = document.getElementById('super-secret-evil-dialog');
  $('#super-secret-evil-dialog .close').click(() => {
    dialog.close();
  });
  $('#evil-command').on('input change', () => {
    let key = $('#evil-command').val().toLowerCase();
    let encodedKey = CryptoJS.SHA512(key + annasalt).toString();
    if (answers.hasOwnProperty(encodedKey)) {
      let answer = CryptoJS.AES.decrypt(answers[encodedKey], key).toString(CryptoJS.enc.Utf8);
      if (answer.startsWith('!')) {
        eval(answer.substring(1))
      } else {
        $('#evil-answer').text(answer);
      }
    } else {
      $('#evil-answer').text('');
    }
  });
  $('#heart').click(() => {
    dialog.showModal();
  });
});
