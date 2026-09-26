 module.exports = async function handler(req, res) {
 if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { name, phone, course } = req.body;

    if (!name || !phone || !course) {
        return res.status(400).json({ ok: false, error: 'Missing fields' });
    }

    const BOT_TOKEN = process.env.BOT_TOKEN;
    const CHAT_ID   = process.env.CHAT_ID;

    if (!BOT_TOKEN || !CHAT_ID) {
        return res.status(500).json({ ok: false, error: 'Server config missing' });
    }

    const message =
        `🌸 New Application from Sakura Website!\n\n` +
        `👤 Name: ${name}\n` +
        `📞 Phone: ${phone}\n` +
        `📚 Course: ${course}`;

    try {
        const response = await fetch(
            `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: CHAT_ID, text: message })
            }
        );

        const data = await response.json();

        if (data.ok) {
            return res.status(200).json({ ok: true });
        } else {
            return res.status(500).json({ ok: false, error: data.description });
        }

    } catch (err) {
        return res.status(500).json({ ok: false, error: err.message });
    }
};