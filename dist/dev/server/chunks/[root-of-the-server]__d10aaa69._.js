module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/src/app/api/send-email/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
;
async function POST(request) {
    try {
        const { type, bookingData } = await request.json();
        const RESEND_API_KEY = ("TURBOPACK compile-time value", "e_GFhZ7UiF_LvwyC6gXScnU2oeevEcdRk5G");
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        let emailData;
        switch(type){
            case 'booking_notification':
                emailData = {
                    from: 'Tecgrw Coworking <onboarding@resend.dev>',
                    to: 'info@tecgrw.com',
                    subject: 'New Coworking Space Booking Request',
                    html: `
            <h2>New Coworking Space Booking Request</h2>
            <p><strong>Name:</strong> ${bookingData.name}</p>
            <p><strong>Email:</strong> ${bookingData.email}</p>
            <p><strong>Phone:</strong> ${bookingData.phone}</p>
            <p><strong>Number of People:</strong> ${bookingData.people}</p>
            <p><strong>Requested Date:</strong> ${bookingData.date ? new Date(bookingData.date).toLocaleDateString() : 'Not specified'}</p>
            <hr>
            <p><em>Please review this booking request in your admin panel.</em></p>
            <p><small>Tecgrw Coworking Management System</small></p>
          `
                };
                break;
            case 'booking_acceptance':
                emailData = {
                    from: 'Tecgrw Coworking <onboarding@resend.dev>',
                    to: bookingData.email,
                    subject: '🎉 Your Coworking Space Booking is Confirmed!',
                    html: `
            <h2>Booking Confirmed!</h2>
            <p>Dear ${bookingData.name},</p>
            <p>Great news! Your coworking space booking has been <strong>confirmed</strong>.</p>
            
            <h3>Booking Details:</h3>
            <ul>
              <li><strong>Date:</strong> ${bookingData.date ? new Date(bookingData.date.seconds ? bookingData.date.seconds * 1000 : bookingData.date).toLocaleDateString() : 'Not specified'}</li>
              <li><strong>Number of People:</strong> ${bookingData.people}</li>
              <li><strong>Phone:</strong> ${bookingData.phone}</li>
            </ul>
            
            <h3>Location:</h3>
            <p>Tecgrw Ltd Office<br>
            KG 317, Kibagabaga, Kigali</p>
            
            <h3>What to Bring:</h3>
            <ul>
              <li>Your laptop and work materials</li>
              <li>A positive attitude and readiness to be productive!</li>
            </ul>
            
            <p>We're excited to welcome you to our coworking community!</p>
            
            <p>Best regards,<br>
            <strong>The Tecgrw Team</strong></p>
            
            <hr>
            <p><small>Questions? Reply to this email or call us at +250 795 583 795</small></p>
          `
                };
                break;
            case 'booking_rejection':
                emailData = {
                    from: 'Tecgrw Coworking <onboarding@resend.dev>',
                    to: bookingData.email,
                    subject: 'Coworking Space Booking Update',
                    html: `
            <h2>Booking Update</h2>
            <p>Dear ${bookingData.name},</p>
            <p>Thank you for your interest in our coworking space.</p>
            
            <p>Unfortunately, we're unable to confirm your booking for the requested date:</p>
            <ul>
              <li><strong>Date:</strong> ${bookingData.date ? new Date(bookingData.date.seconds ? bookingData.date.seconds * 1000 : bookingData.date).toLocaleDateString() : 'Not specified'}</li>
              <li><strong>Number of People:</strong> ${bookingData.people}</li>
            </ul>
            
            <p>This could be due to:</p>
            <ul>
              <li>The date is already fully booked</li>
              <li>The space isn't available on that day</li>
              <li>Capacity limitations</li>
            </ul>
            
            <p><strong>We'd love to help you find an alternative!</strong><br>
            Please contact us to discuss other available dates:</p>
            
            <p>📞 <strong>Call/WhatsApp:</strong> +250 795 583 795 or +250 798 975 878<br>
            📧 <strong>Email:</strong> info@tecgrw.com</p>
            
            <p>Thank you for understanding, and we hope to welcome you soon!</p>
            
            <p>Best regards,<br>
            <strong>The Tecgrw Team</strong></p>
          `
                };
                break;
            default:
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: 'Invalid email type'
                }, {
                    status: 400
                });
        }
        console.log('Sending email with data:', emailData);
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${RESEND_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(emailData)
        });
        console.log('Response status:', response.status);
        if (!response.ok) {
            const error = await response.text();
            console.error('Email sending failed:', error);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: `Failed to send email: ${error}`
            }, {
                status: response.status
            });
        }
        const result = await response.json();
        console.log('Email sent successfully:', result);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            result
        });
    } catch (error) {
        console.error('Email API error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Internal server error'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__d10aaa69._.js.map