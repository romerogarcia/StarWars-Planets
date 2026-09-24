import swal from 'sweetalert';

export function successAlert(title: string): void {
  void swal({ title, icon: 'success', buttons: { confirm: { text: 'Ok' } }, timer: 2000 });
}
