export function hitungTelat(itungtelat) {
    if (Math.floor(itungtelat % 30) == 0) {
        return itungtelat
    } else {
        return itungtelat - (Math.floor(itungtelat % 30)) + 30
    }
}

export function hitungPotongan(waktu: number, upahtunjangan: number): number {
    if (waktu == 0) {
      return 0
    }
    else if (waktu <= 3 && waktu > 0) {
      return 2000
    } else if (waktu <= 5 && waktu >= 4) {
      return 3000
    } else if (waktu > 5) {
      return (upahtunjangan / 7) * (waktu / 60)
    }
  }