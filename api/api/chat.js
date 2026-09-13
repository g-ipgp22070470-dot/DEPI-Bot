module.exports = async function handler(req, res) {

    // Hanya benarkan POST
    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Method tidak dibenarkan"
        });
    }

    try {

        const { passage, question, answer } = req.body;

        if (!passage || !question || !answer) {
            return res.status(400).json({
                error: "Petikan, soalan dan jawapan diperlukan."
            });
        }

        const prompt = `
Anda ialah DEPI-BOT, sebuah bot pendidikan Bahasa Melayu
untuk membantu murid mengenal pasti maklumat tersurat.

TUGAS ANDA:
1. Analisis petikan.
2. Analisis soalan.
3. Semak jawapan murid.
4. Tentukan sama ada jawapan berdasarkan maklumat tersurat.
5. Jangan menerima maklumat yang tidak terdapat dalam petikan.
6. Berikan petunjuk jika jawapan kurang tepat.
7. Berikan bukti daripada petikan.
8. Berikan markah daripada 4.

PETIKAN:
${passage}

SOALAN:
${question}

JAWAPAN MURID:
${answer}

Jawab dalam format berikut:

KEPUTUSAN:
[Betul / Hampir Betul / Cuba Lagi]

MARKAH:
[0 hingga 4]

BUKTI DARIPADA PETIKAN:
[Petikan pendek yang menyokong jawapan]

MAKLUM BALAS:
[Maklum balas mudah dan mesra murid]

PETUNJUK:
[Petunjuk yang membantu murid tanpa memberikan jawapan secara terus]

CADANGAN AYAT:
[Cadangan jawapan dalam ayat lengkap]
`;

        const response = await fetch(
            "https://api.openai.com/v1/responses",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization":
                        `Bearer ${process.env.OPENAI_API_KEY}`
                },

                body: JSON.stringify({
                    model: "gpt-5.6-luna",
                    input: prompt
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({
                error: data.error?.message || "Ralat API"
            });
        }

        return res.status(200).json({
            result: data.output_text
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            error: "Ralat berlaku pada server DEPI-BOT."
        });
    }
}
