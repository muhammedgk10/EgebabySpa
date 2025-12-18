
import { Appointment } from '../types';

export const sendBookingConfirmation = async (appointment: Omit<Appointment, 'id' | 'status'>): Promise<void> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  console.group('%c📧 [Email Service] Sending Booking Confirmation', 'color: #2A9D8F; font-weight: bold; font-size: 12px;');
  console.log(`To: ${appointment.email}`);
  console.log(`Subject: ✅ Randevu Talebiniz Alındı: ${appointment.service}`);
  console.log(`
    Sayın ${appointment.parent},

    Ege Baby Spa'yı tercih ettiğiniz için teşekkür ederiz.
    Randevu talebiniz başarıyla alınmıştır.

    📋 Randevu Detayları:
    --------------------------------
    Hizmet: ${appointment.service}
    Tarih: ${appointment.date}
    Saat: ${appointment.time}
    Fiyat: ${appointment.price}
    Bebek: ${appointment.baby}

    📞 İletişim: ${appointment.phone}

    Uzmanlarımız randevunuzu onaylamak için en kısa sürede sizi arayacaktır.
    
    Sağlıklı günler dileriz,
    Ege Baby Spa & Wellness Ekibi
    www.egebabyspa.com
  `);
  console.groupEnd();
};
