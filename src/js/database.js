import Cookies from 'js-cookie';

// อัพเดทจำนวนการ์ดที่ถูกจับทั้งหมด
export const updateTotalDrawnCards = async (count) => {
    try {
        const response = await fetch(`http://localhost:3000/draw-card`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ count }),
        });

        if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error('Error updating total drawn cards:', error);
    }
};

// บันทึกคำถามและคำตอบไพ่ทาโรต์
export const saveTarotResponse = async (question, answer) => {
    try {
        const userId = Cookies.get('userId');
        if (userId !== undefined) {
            const bodyData = { userId, question, answer };
    
            const response = await fetch('http://localhost:3000/tarot-response', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bodyData),
            });
    
            const data = await response.json();
            console.log(data);
        }
    } catch (error) {
        console.error('Error saving tarot response:', error);
    }
};

// ลบคำถามและคำตอบไพ่ทาโรต์ตาม userId
export const deleteTarotResponses = async () => {
    try {
        const userId = Cookies.get('userId');
        if (userId !== undefined) {
            const response = await fetch(`http://localhost:3000/delete-tarot-responses/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            console.log(data);
        }
    } catch (error) {
        console.error('Error deleting tarot responses:', error);
    }
};
